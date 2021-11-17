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

type FData = {
    userKey?: string,
    nodeKey: string,
    followerKey?: string,
    data?: undefined
}


async function getList(nodeKey: Guid) {
    const str = nodeKey.toString();
    console.log(`getList ${str}`);
    await axios.get<Data[]>(`${host}lists/1/${str}`,
    )
        .then(function (response) {
            if (response.status === 200 && response.data[0].nodeKey === str) {
                console.log(response.status, 'success');
            } else {
                console.log(response.status, 'fail');
            }
        })
        .catch(function (error) {
            console.log('fail', error);
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
    await axios.post<Data[]>(`${host}lists/1`, postData)
        .then(function (response) {
            if (response.status === 200 && response.data[0].nodeKey === postData.nodeKey) {
                console.log(response.status, 'success');
            } else {
                console.log(response.status, 'fail');
            }
        })
        .catch(function (error) {
            console.log('fail', error);
        });
}

async function updateList(nodeKey: Guid, isDataNull: boolean = false) {
    const str = nodeKey.toString();
    console.log(`updateList ${str}`);
    const postData = {
        nodeKey: undefined,
        name: str.slice(0, 6) + '_' + isDataNull ? 'N' : 'U',
        nodeType: 0,
        data: isDataNull ? [
            {nodeKey: str.slice(9, 13), name: str.slice(14, 16) + '_U', nodeType: 0}
        ] : null
    };
    await axios.put<Data[]>(`${host}lists/1/${nodeKey}`, postData)
        .then(function (response) {
            if (response.status === 200 && response.data[0].nodeKey === str) {
                console.log(response.status, 'success');
            } else {
                console.log(response.status, 'fail');
            }
        })
        .catch(function (error) {
            console.log('fail', error);
        });
}

async function deleteList(nodeKey: Guid) {
    const str = nodeKey.toString();
    console.log(`deleteList ${str}`);
    await axios.delete<Data[]>(`${host}lists/1/${str}`)
        .then(function (response) {
            if (response.status === 200 && response.data.length === 0) {
                console.log(response.status, 'success');
            } else {
                console.log(response.status, 'fail');
            }
        })
        .catch(function (error) {
            console.log('fail', error);
        });
}



async function getFollowers(nodeKey: Guid, followerKey: Guid | null = null) {
    const str = nodeKey.toString();
    const followerStr = followerKey ? '/' + followerKey.toString() : '';
    console.log(`getFollowers ${str}`);
    await axios.get<FData[]>(`${host}followers/1/${str}${followerStr}`,
    )
        .then(function (response) {
            if (response.status === 200 && response.data[0].nodeKey === str) {
                if (!followerKey) {
                    console.log(response.status, 'success');
                }
                else {
                    if (followerKey.toString() === response.data[0].followerKey) {
                        console.log(response.status, 'success');
                    }
                    else {
                        console.log(response.status, 'fail');
                    }
                }
            } else {
                console.log(response.status, 'fail');
            }
        })
        .catch(function (error) {
            console.log('feil', error);
        });
}

async function createFollowers(nodeKey: Guid, followerKey: Guid) {
    const str = nodeKey.toString();
    const followerStr = followerKey.toString();
    console.log(`createFollower ${str}`);
    const postData = {
        nodeKey: str,
        followerKey: followerStr
    };
    await axios.post<FData[]>(`${host}followers/1`, postData)
        .then(function (response) {
            if (response.status === 200 &&
                response.data[0].nodeKey === postData.nodeKey &&
                response.data[0].followerKey === postData.followerKey) {
                console.log(response.status, 'success');
            } else {
                console.log(response.status, 'fail');
            }
        })
        .catch(function (error) {
            console.log('fail', error);
        });
}

async function deleteFollowers(nodeKey: Guid, followerKey: Guid | null = null) {
    const str = nodeKey.toString();
    const followerStr = followerKey ? '/' + followerKey.toString() : '';
    console.log(`deleteFollower ${str}`);
    await axios.delete<FData[]>(`${host}followers/1/${str}${followerStr}`)
        .then(function (response) {
            if (response.status === 200 && response.data.length === 0) {
                console.log(response.status, 'success');
            } else {
                console.log(response.status, 'fail');
            }
        })
        .catch(function (error) {
            console.log('fail', error);
        });
}

axios.get<Data[]>(`${host}lists/1`)
    .then(async function (response) {
        console.log('lists count before');
        console.log(response.data.length);
        const listId = Guid.create();
        console.log(`create / update ${listId}`);
        await createList(listId);
        await getList(listId);
        await updateList(listId);
        await updateList(listId, true);
        await deleteList(listId);
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
            .finally(
                function () {
                    axios.get<FData[]>(`${host}followers/1`)
                        .then(async function (response) {
                            console.log('followers count before');
                            console.log(response.data.length);
                            const nodeId = Guid.create();
                            const followerId = Guid.create();
                            console.log(`create / update ${followerId}`);
                            await createFollowers(nodeId, followerId);
                            await getFollowers(nodeId);
                            await getFollowers(nodeId, followerId);
                            await deleteFollowers(nodeId, followerId);
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(async function () {
                            await axios.get<FData[]>(`${host}followers/1`)
                                .then(function (response) {
                                    console.log('followers count after');
                                    console.log(response.data.length);
                                })
                                .catch(function (error) {
                                    console.log(error);
                                })
                        })
                }
            )
    });

