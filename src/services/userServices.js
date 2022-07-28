const fs = require('fs')
const path = require('path')
const datastore = require('../datastore.json')

const filterById = (id) => {
  return datastore.filter((user) => user.id === id);
};

const indexOfUser = (id) => {
  return datastore.indexOf(filterById(id)[0]);
};

const getAll = async () => {
  return JSON.parse(fs.readFileSync('./src/datastore.json'));
  //return datastore;
};

const getUser = async (id) => {
  return filterById(id)[0];
};

const addUser = async (userInfo) => {
  const newId = datastore[datastore.length - 1].id + 1;

  datastore.push({
    id: newId,
    ...userInfo,
  });

  fs.writeFileSync('./src/datastore.json', JSON.stringify(datastore))
  return datastore;
};

const updateUser = async (id, userInfo) => {
  const index = indexOfUser(id);

  if (index !== -1) {
    datastore[index] = { id: datastore[index].id, ...userInfo };
    fs.writeFileSync('./src/datastore.json', JSON.stringify(datastore))
    return datastore;
  } else {
    return "User not found";
  }
};

module.exports = { getAll, getUser, addUser, updateUser };
