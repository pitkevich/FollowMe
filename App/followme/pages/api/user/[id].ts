import type { NextApiRequest, NextApiResponse } from 'next'
import {query} from "../../../lib/db";


type Data = {
    token: string,
    name: string,
    picKey?: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case 'GET':
            // Get data from your database
            // const results = await query(
            //     `SELECT ... FROM ... WHERE id = ?`,
            //     id
            // );
            // return res.json(results[0])
            //
            if (id === '1') {
                res.status(200).json({ token: '1', name: 'John Doe' })
            }
            else {
                res.status(404).end(`\'${id}\' Not Found`)
            }
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}
