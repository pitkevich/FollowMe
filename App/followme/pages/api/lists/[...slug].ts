import type {NextApiRequest, NextApiResponse} from 'next'
import {insert, query} from "../../../lib/db";

type Data = {
    userKey?: string,
    nodeKey: string,
    name: string,
    nodeType: number
    data?: Data[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[] | Data>
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
            // Get data from your database
            if (process.env.STORAGE === 'MYSQL') {
                const result = nodeKey !== '' ? await query<Data>(
                        `SELECT userKey, nodeKey, name, nodeType, data FROM store.dlists WHERE nodeKey=?;`,
                        nodeKey
                    ) :
                    await query<Data>(
                        `SELECT userKey, nodeKey, name, nodeType, data FROM store.dlists WHERE userKey=?;`,
                        id
                    );

                if (!result.success) {
                    res.status(500).end(result.message ?? 'unknown error');
                } else if (!result.data) {
                    res.status(404).end(`\'${slug}\' Not Found`)
                } else {
                    res.json(result.data);
                }
            } else {
                if (id !== '1') {
                    res.status(404).end(`\'${id}\' Not Found`)
                }
                if (nodeKey === '1') {
                    res.status(200).json({
                        nodeKey: '1',
                        name: 'John Doe',
                        nodeType: 0,
                        data: [{nodeKey: '2', name: 'Max Pain', nodeType: 0}]
                    });
                } else { // if (listKey === undefined) {
                    res.status(200).json([{nodeKey: '1', name: 'John Doe', nodeType: 0}, {
                        nodeKey: '10',
                        name: 'Dim Dim',
                        nodeType: 0
                    }]);
                }
            }
            break;
        case 'POST':
            // Get data from your database
            const data = body as Data;
            if (data === undefined){
                res.status(405).end(`Method ${method} Not Allowed with empty list item.`)
            }
            data.userKey = id;

            if (process.env.STORAGE === 'MYSQL') {
                const inserted = await insert<Data>(
                    `INSERT INTO store.dlists (userKey, nodeKey, name, nodeType, data) 
                            VALUES(?, ?, ?, ?, ?);
                            SELECT userKey, nodeKey, name, nodeType, data FROM store.dlists WHERE nodeKey=?;`,
                    [data.userKey, data.nodeKey, data.name, data.nodeType,
                        data.data ? JSON.stringify(data.data) : null,
                        data.nodeKey]
                );
                if (!inserted.success || !inserted.data) {
                    res.status(500).end(inserted.message ?? 'unknown error');
                } else {
                    res.json(inserted.data);
                }
            }
            else{
                if (id === '1') {
                    res.status(200).json([{nodeKey: '1', name: 'John Doe', nodeType: 0}, {
                        nodeKey: '10',
                        name: 'Dim Dim',
                        nodeType: 0
                    }]);
                }
                else {
                    res.status(404).end(`\'${id}\' Not Found`)
                }
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}
