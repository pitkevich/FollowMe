import axios from "axios";
import {Guid} from "guid-typescript";

const host = 'http://localhost:3000/api/';

type Data = {
    userKey?: string,
    nodeKey: string,
    name: string,
    nodeType: number
    data?: Data[]
}

async function getList(nodeKey: Guid) {
    const str = nodeKey.toString();
    console.log(`getList ${str}`);
    await axios.get<Data>(`${host}lists/1/${str}`,
    )
        .then(function (response) {
            console.log(response.status);
            if (response.data.nodeKey === str) {
                console.log('success');
            } else {
                console.log('fail');
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

async function createList(nodeKey: Guid) {
    const str = nodeKey.toString();
    console.log(`createList ${str}`);
    const postData = {
        nodeKey: str,
        name: str.slice(0, 8),
        nodeType: 0,
        data: [
            {nodeKey: str.slice(9, 13), name: str.slice(14, 18), nodeType: 0}
        ]
    };
    await axios.post<Data>(`${host}lists/1`, postData)
        .then(function (response) {
            console.log(response.status);
            if (response.data.nodeKey === postData.nodeKey) {
                console.log('success');
            } else {
                console.log('fail');
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log('fail');
        })
        .then(function () {
            // always executed
        });
}


axios.get<Data[]>(`${host}lists/1`)
    .then(async function (response) {
        console.log('lists count before');
        console.log(response.data.length);
        const listId = Guid.create();
        await createList(listId);
        await getList(listId);
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(async function () {
        await axios.get<Data[]>(`${host}lists/1`)
            .then(function (response) {
                console.log('lists count after');
                console.log(response.data.length);
            })
            .catch(function (error) {
                console.log(error);
            })
    });
