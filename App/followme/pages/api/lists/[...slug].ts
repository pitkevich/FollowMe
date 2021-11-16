import type {NextApiRequest, NextApiResponse} from 'next'
import {insert, query, remove, update} from "../../../lib/db";

type Data = {
    userKey?: string,
    nodeKey: string,
    name: string,
    nodeType: number
    data?: Data[]
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
            }
            else {
                if (id !== '1') {
                    res.status(404).end(`\'${id}\' Not Found`)
                }
                if (nodeKey === '1') {
                    res.status(200).json([{
                        nodeKey: '1',
                        name: 'John Doe',
                        nodeType: 0,
                        data: [{nodeKey: '2', name: 'Max Pain', nodeType: 0}]
                    }]);
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
            const dataPost = body as Data;
            if (dataPost === undefined){
                res.status(405).end(`Method ${method} Not Allowed with empty list item.`)
            }
            dataPost.userKey = id;

            if (process.env.STORAGE === 'MYSQL') {
                const inserted = await insert<Data>(
                    `INSERT INTO store.dlists (userKey, nodeKey, name, nodeType, data) 
                            VALUES(?, ?, ?, ?, ?);
                            SELECT userKey, nodeKey, name, nodeType, data FROM store.dlists WHERE nodeKey=?;`,
                    [dataPost.userKey, dataPost.nodeKey, dataPost.name, dataPost.nodeType,
                        dataPost.data ? JSON.stringify(dataPost.data) : null,
                        dataPost.nodeKey]
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
        case 'PUT':
            const dataPut = body as Data;
            if (dataPut.name === undefined && dataPut.data === undefined){
                res.status(405).end(`Method ${method} Not Allowed with empty list item.`)
            }

            if (process.env.STORAGE === 'MYSQL') {
                let setStr = '';
                let values: (string | null)[] = [nodeKey, nodeKey];
                if (dataPut.name) {
                    values = [dataPut.name, ...values];
                    setStr = 'name=?';
                }
                if (dataPut.data) {
                    values = [JSON.stringify(dataPut.data), ...values];
                    setStr = setStr.length > 0 ? 'data=?, ' + setStr : 'data=?';
                }
                if (dataPut.data === null) {
                    setStr = setStr.length > 0 ? 'data=null, ' + setStr : 'data=null';
                }
                const updated = await update<Data>(
                    `UPDATE store.dlists SET ${setStr} WHERE nodeKey=?;
                        SELECT userKey, nodeKey, name, nodeType, data FROM store.dlists WHERE nodeKey=?;`,
                    values
                );
                if (!updated.success) {
                    res.status(500).end(updated.message ?? 'unknown error');
                }
                else if (updated.success && updated.message) {
                    res.status(404).end(`\'${id}\' Not Found`)
                }
                else {
                    res.json(updated.data);
                }
            }
            else {
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
        case 'DELETE':
            if (process.env.STORAGE === 'MYSQL') {
                const deleted = await remove<Data>(
                    `DELETE FROM store.dlists WHERE nodeKey=?;`,
                    nodeKey
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
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}
