import type {NextApiRequest, NextApiResponse} from 'next'
import {insert, query, remove} from "../../../lib/db";

type Data = {
    userKey?: string,
    nodeKey: string,
    followerKey?: string,
    data?: undefined
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {
    const {
        query: {slug},
        body,
        method,
    } = req;

    if (!Array.isArray(slug) || slug.length < 1) {
        res.status(404).end(`\'${slug}\' Not Found`)
    }
    const id = slug[0];
    const nodeKey = slug.length > 1 ? slug[1] : '';

    switch (method) {
        case 'GET':
            if (process.env.STORAGE === 'MYSQL') {
                const result = nodeKey !== '' ? await query<Data>(
                        `SELECT userKey, nodeKey, followerKey FROM store.dfollowers WHERE userKey=? AND nodeKey=?;`,
                        [id , nodeKey]
                    ) :
                    await query<Data>(
                        `SELECT userKey, nodeKey, followerKey FROM store.dfollowers WHERE userKey=?;`,
                        id
                    );

                if (!result.success) {
                    res.status(500).end(result.message ?? 'Unknown error');
                } else if (!result.data) {
                    res.status(404).end(`\'${slug}\' Not Found`)
                } else {
                    res.json(result.data);
                }
            }
            else {
                if (id !== '1') {
                    res.status(404).end(`\'${id}\' Not Found`)
                }
                if (nodeKey === '1') {
                    res.status(200).json([{
                        nodeKey: '1',
                        followerKey: '0',
                    }]);
                } else { // if (nodeKey === undefined) {
                    res.status(200).json([{nodeKey: '1', followerKey: '0'},
                        {nodeKey: '2', followerKey: '0'}]);
                }
            }
            break;
        case 'POST':
            const dataPost: Data = body;
            if (!dataPost?.followerKey){
                res.status(405).end(`Method ${method} Not Allowed with empty follower.`)
            }
            dataPost.userKey = id;

            if (process.env.STORAGE === 'MYSQL') {
                const inserted = dataPost.nodeKey ?
                    await insert<Data>(
                    `INSERT INTO store.dfollowers (userKey, nodeKey, followerKey) VALUES(?, ?, ?);
                        SELECT userKey, nodeKey, followerKey FROM store.dfollowers WHERE userKey=? AND nodeKey=?;`,
                    [dataPost.userKey, dataPost.nodeKey, dataPost.followerKey, dataPost.userKey, dataPost.nodeKey]
                    ) :
                    await insert<Data>(
                        `INSERT INTO store.dfollowers (userKey, nodeKey, followerKey) 
                            SELECT userKey, nodeKey, ? FROM store.dlists WHERE userKey=?;
                            SELECT userKey, nodeKey, followerKey FROM store.dfollowers WHERE userKey=?;`,
                        [dataPost.followerKey, dataPost.userKey, dataPost.userKey]
                    );
                if (!inserted.success) {
                    res.status(500).end(inserted.message ?? 'unknown error');
                }
                else {
                    res.json(inserted.data);
                }
            }
            else{
                if (id === '1') {
                    res.status(200).json([{
                        nodeKey: '1',
                        followerKey: '0',
                    }]);
                }
                else {
                    res.status(404).end(`\'${id}\' Not Found`)
                }
            }
            break;
        case 'DELETE':
            if (process.env.STORAGE === 'MYSQL') {
                const followerKey = slug.length > 2 ? slug[2] : '';
                if (!id || nodeKey === '' || followerKey === ''){
                    res.status(405).end(`Method ${method} Not Allowed with empty follower and nodeKey.`)
                }

                const deleted = nodeKey === 'all' ?
                    await remove<Data>(
                        `DELETE FROM store.dfollowers WHERE userKey=? AND followerKey=?;`,
                        [id, followerKey]
                    ) :
                    await remove<Data>(
                        `DELETE FROM store.dfollowers WHERE userKey=? AND followerKey=? AND nodeKey=?;`,
                        [id, followerKey, nodeKey]
                    );

                if (!deleted.success) {
                    res.status(500).end(deleted.message ?? 'unknown error');
                }
                else if (deleted.success && deleted.message) {
                    res.status(404).end(`\'${nodeKey}\' Not Found`)
                } else {
                    res.json([]);
                }
            }
            else {
                res.status(200).json([]);
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}
