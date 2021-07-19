const graph = require('@microsoft/microsoft-graph-client');
const refreshAccessToken =  require('./bin/refreshToken');
let timeStamp = Date.now()
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
    const client = getAuthenticatedClient(accessToken);

    return await client  
      .api(`/users/${userID}/transitiveMemberOf`)
      .get();
  },

  getAllPlanners: async function getPlanners(accessToken, groupID) {
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`/groups/${groupID}/planner/plans`)
      .get();
  },

  getAllTasks: async function getTasks(accessToken, planID) {
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`/planner/plans/${planID}/tasks`)
      .get();
  },

  getSingleTask: async function getTasks(accessToken, taskID) {
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`planner/tasks/${taskID}`)
      .get();
  },

  getDetailedTask: async function getTasks(accessToken, taskID) {
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`planner/tasks/${taskID}/details`)
      .get();
  },

  getTaskTitle: async function getTasks(accessToken, taskID) {
    const client = getAuthenticatedClient(accessToken);

    return await client
      .api(`planner/tasks/${taskID}`)
      .select('title')
      .get();
  },


  getUserPlanners: async function getUserPlanners(accessToken, userID) {
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
  const timeElapsed = Math.floor((Date.now() - timeStamp) /1000)

  if(timeElapsed > 3500){
    verifyAcessToken(client, accessToken)
  }
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
  console.log('getAuthenticatedClient')
  return client
}

async function verifyAcessToken(client, accessToken){
  console.log('verifyAcessToken')
  try {
    const user = await client
      .api('/me')
      .select('displayName')
      .get();
      console.log(user)
  } catch (error) {
    if(error.code === 'InvalidAuthenticationToken'){
      timeStamp = Date.now()
      getAccessToken()
    }else{
      console.log(error); // TypeError: failed to fetch
    }
  }
}

function getAccessToken(accessToken){
  console.log('getAccessToken')

    refreshAccessToken.getJSON(accessToken, (statusCode, result) => {
      // I could work with the resulting HTML/JSON here. I could also just return it
      console.log(`onResult: (${statusCode})\n\n${JSON.stringify(result)}`);
    });
}
