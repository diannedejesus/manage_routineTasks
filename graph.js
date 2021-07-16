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

  getDetailedTask: async function getTasks(accessToken, taskID) {
    //ensureScope('Directory.AccessAsUser.All' );
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`planner/tasks/${taskID}/details`)
      .get();
  },

  getTaskTitle: async function getTasks(accessToken, taskID) {
    //ensureScope('Directory.AccessAsUser.All' );
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`planner/tasks/${taskID}`)
      .select('title')
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
      async (groupInfo) => {
       
        if(groupInfo.displayName != 'Global Administrator'){
          try {
            const getPlanner  = await this.getAllPlanners(accessToken, groupInfo.id)
            if(getPlanner && getPlanner.value.length > 0){
              //console.log(getPlanner.value)
              planners.push({planner: getPlanner.value, group: groupInfo.id})
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

    planners.forEach(plannerGroup => plannerGroup.planner.forEach(plannerInfo => plannerIDs.push({id: plannerInfo.id, group: plannerGroup.group})))
    
    await Promise.all(plannerIDs.map(
      async (plannerInfo) => {
          try {
            const getTasks  = await this.getAllTasks(accessToken, plannerInfo.id)
            
            getTasks.value.forEach(taskInfo => {
              //console.log(el.title)
              //plannerTasks[el.title] = el.id
              //plannerTasks.push({[el.title] : el.id})
              //plannerTasks.push(`${el.title}::${el.id}`)

              plannerTasks.push({title: taskInfo.title, id: plannerInfo.id, group: plannerInfo.group})
            })
            //console.log(plannerTasks)
          } catch(err) {
            console.log(err); // TypeError: failed to fetch
          }
      }
    ))

    //find task
    console.log('Searched for task')
    //plannerTasks.filter(el => console.log(el))
    return plannerTasks.filter( taskInfo => taskInfo.title.toLowerCase().includes( searchTerm.toLowerCase() ) )
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