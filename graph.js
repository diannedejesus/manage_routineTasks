const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();
    return user;
  },

  getAllGroups: async function getMyGroups(accessToken, userID) {
    //ensureScope('Directory.AccessAsUser.All' );
    const client = getAuthenticatedClient(accessToken);

    return await client  
      .api(`/users/${userID}/transitiveMemberOf`)
      .get();
  },

  getAllPlanners: async function getPlanners(accessToken, groupID) {
    //ensureScope('Directory.AccessAsUser.All' );
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`/groups/${groupID}/planner/plans`)
      .get();
  },

  getAllTasks: async function getTasks(accessToken, planID) {
    //ensureScope('Directory.AccessAsUser.All' );
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`/planner/plans/${planID}/tasks`)
      .get();
  },

  getSingleTask: async function getTasks(accessToken, taskID) {
    //ensureScope('Directory.AccessAsUser.All' );
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`planner/tasks/${taskID}`)
      .get();
  },

  getUserPlanners: async function getUserPlanners(accessToken, userID) {
    //ensureScope('Directory.AccessAsUser.All' );
    //const client = getAuthenticatedClient(accessToken);
    let getUserGroups
    try {
      getUserGroups = await this.getAllGroups(accessToken, userID)
    } catch(err) {
      console.log(err); // TypeError: failed to fetch
    }
    
    let planners = []

    
    await Promise.all(getUserGroups.value.map(
      async (element) => {
        if(element.displayName != 'Global Administrator'){
          try {
            const getPlanner  = await this.getAllPlanners(accessToken, element.id)
            if(getPlanner && getPlanner.value.length > 0){
              //console.log(getPlanner.value)
              planners.push(getPlanner.value)
            }
          } catch(err) {
            console.log(err); // TypeError: failed to fetch
          }
        }
      }
    ))
    return planners
   
  },

  searchAllPlanners: async function (accessToken, userID, searchTerm){
    const planners = await this.getUserPlanners(accessToken, userID)
    let plannerIDs = []
    let plannerTasks = []

    planners.forEach(el => el.forEach(ele => plannerIDs.push(ele.id)))

    await Promise.all(plannerIDs.map(
      async (element) => {
          try {
            const getTasks  = await this.getAllTasks(accessToken, element)
            
            getTasks.value.forEach(el => {
              //console.log(el.title)
              //plannerTasks[el.title] = el.id
              //plannerTasks.push({[el.title] : el.id})
              plannerTasks.push(`${el.title}::${el.id}`)
            })
          } catch(err) {
            console.log(err); // TypeError: failed to fetch
          }
      }
    ))

    //find task
    console.log('Searched for task:')
    //plannerTasks.filter(el => console.log(el))
    return plannerTasks.filter( el => el.toLowerCase().includes( searchTerm.toLowerCase() ) )
  },
  
}


function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}