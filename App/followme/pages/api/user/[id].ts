import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    token: string,
    name: string,
    picKey?: number
}

export default function handler(
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
