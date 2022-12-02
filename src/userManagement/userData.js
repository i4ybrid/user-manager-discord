
/**
 * Finds a user by email address
 * @param {string} email 
 */
function findUserByEmail(email) {

}

/**
 * Finds a user by a string of {username}#{discriminnator}
 * @param {string} name 
 */
function findUserByString(name) {

}

/**
 * Finds a user by id
 * @param {string} id 
 */
function findUserById(id) {

}

/**
 * Stores user into a database of some sort
 * @param {string} userObject
 */
function saveUser(userObject) {

}


function loadUsersIntoMemory() {
  const users = [];
  global.userById = users.reduce((accumulator, value) => {
    accumulator[value.id] = value;
    return accumulator;
  }, {});
  global.userByEmail = users.reduce((accumulator, value) => {
    //TODO How do we connect the stripe e-mail to the user id?
    return accumulator;
  }, {});
  global.userByString = users.reduce((accumulator, value) => {
    accumulator[value.tag] = value;
    return accumulator;
  }, {});
}
