import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    nodeKey: string,
    name: string,
    nodeType: number
    data?: Data[]
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {
    const {
        query: { slug },
        method,
    } = req;

    if (!Array.isArray(slug) || slug.length < 1){
        res.status(404).end(`\'${slug}\' Not Found`)
    }
    const id = slug[0];
    const listKey = slug.length > 1 ? slug[1] : undefined;

    switch (method) {
        case 'GET':
            // Get data from your database
            if (id !== '1') {
                res.status(404).end(`\'${id}\' Not Found`)
            }
            if (listKey === '1'){
                res.status(200).json([{ nodeKey: '1', name: 'John Doe', nodeType: 0, data: [{ nodeKey: '2', name: 'Max Pain', nodeType: 0}] }])
            }
            else { // if (listKey === undefined) {
                res.status(200).json([{ nodeKey: '1', name: 'John Doe', nodeType: 0 }, { nodeKey: '10', name: 'Dim Dim', nodeType: 0 }]);
            }
            break;
        case 'POST':
            // Get data from your database
            // if (id === '1') {
            //     res.status(200).json({ token: '1', name: 'John Doe' })
            // }
            // else {
                res.status(404).end(`\'${id}\' Not Found`)
            // }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}
