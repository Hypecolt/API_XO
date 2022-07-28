const userServices = require('../services/userServices.js')
const fromString = require('uuidv4')

//Add User
const addUser = async(req, res, next) => {
  try {
    if (!req?.body?.name) {
      throw { message: "No name provided" };
    }

    const secretId = fromString.fromString(req.body.name);

    const response = await userServices.addUser({
      name: req.body.name,
      secretId: secretId
    });

    res.json(response);
  } catch (err) {
    console.error(`Error while adding user`);
    next(err);
  }
};

//patch User
const updateUser = async (req, res, next) => {
  try {
    if (!req?.params?.id) {
      throw { message: "No parameter provided" };
    }

    const id = parseInt(req.params.id);
    const user = await userServices.getUser(id);

    if (!user) {
      throw { message: "User not found" };
    }

    const response = await userServices.updateUser(id, {
      name: req?.body?.name || user.name,
      secretId: user.secretId
    });

    res.json(response);
  } catch (err) {
    console.error(`Error while updating user`);
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    res.json(await userServices.getAll());
  } catch (err) {
    console.error(`Error while getting users`);
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    if (!req?.params?.id) {
      throw { message: "No parameter provided" };
    }

    const response = await userServices.getUser(parseInt(req.params.id));

    if (!response) {
      throw { message: "No user found" };
    }

    res.json(response);
  } catch (err) {
    console.error(`Error while getting user`);
    next(err);
  }
};

module.exports = { getUsers, getUser, addUser, updateUser };
