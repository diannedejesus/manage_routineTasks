const graph = require('@microsoft/microsoft-graph-client');
const refreshAccessToken =  require('./bin/refreshToken');
let timeStamp = Date.now()
require('isomorphic-fetch');
//TODO add error catching for if the timed refresh token is not activated before trying to access the 
//api

module.exports = {
  getUserDetails: async function(accessToken) {
    console.log('getUserDetails')
    const client = getAuthenticatedClient(accessToken);

    try {
      ///api call
      const user = await client
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();

      return user;

    } catch (error) {
      if(error.code === 'InvalidAuthenticationToken'){
        //getAccessToken(accessToken)
        console.log('InvalidAuthenticationToken')
      }else{
        console.log(error); // TypeError: failed to fetch
      }
    }
  },

  // getUserPhoto: async function(accessToken) {
  //   console.log('getUserDetails')
  //   const client = getAuthenticatedClient(accessToken);

  //   try {
  //     ///api call
  //     const user = await client
  //       .api('/users/21da6ced-885b-4e7d-a832-6dc50d62bf49/photo/')
  //       .get();

  //       console.log(user)
  //     return user;

  //   } catch (error) {
  //     console.log(error); // TypeError: failed to fetch
  //   }
  // },

  // getAllGroups: async function getMyGroups(accessToken, userID) {
  //   console.log('getAllGroups')
  //   try{
  //     const client = getAuthenticatedClient(accessToken);

  //     return await client  
  //       .api(`/users/${userID}/transitiveMemberOf`)
  //       .get();
  //   } catch (error) {
  //       console.log(error); // TypeError: failed to fetch
  //   }
  // },

  // getAllPlanners: async function getPlanners(accessToken, groupID) {
  //   console.log('getAllPlanners')
  //   try{
  //     const client = getAuthenticatedClient(accessToken);

  //     return await client
  //       .api(`/groups/${groupID}/planner/plans`)
  //       .get();

  //   } catch (error) {
  //     console.log(error); // TypeError: failed to fetch
  //   }
  // },

  // getAllTasks: async function getTasks(accessToken, planID) {
  //   console.log('getAllTasks')
  //   try{
  //     const client = getAuthenticatedClient(accessToken);

  //     return await client
  //       .api(`/planner/plans/${planID}/tasks`)
  //       .get();

  //   } catch (error) {
  //     console.log(error); // TypeError: failed to fetch
  //   }
  // },

  // getSingleTask: async function getTasks(accessToken, taskID) {
  //   console.log('getSingleTask')
  //   try{
  //     const client = getAuthenticatedClient(accessToken);

  //     return await client
  //       .api(`planner/tasks/${taskID}`)
  //       .get();

  //   } catch (error) {
  //     console.log(error); // TypeError: failed to fetch
  //   }
  // },

  // getDetailedTask: async function getTasks(accessToken, taskID) {
  //   console.log('getDetailedTask')
  //   try{
  //     const client = getAuthenticatedClient(accessToken);

  //     return await client
  //       .api(`planner/tasks/${taskID}/details`)
  //       .get();

  //   } catch (error) {
  //     console.log(error); // TypeError: failed to fetch
  //   }
  // },

  // getTaskTitle: async function getTasks(accessToken, taskID) {
  //   console.log('getTaskTitle')
  //   try{
  //     const client = getAuthenticatedClient(accessToken);

  //     return await client
  //       .api(`planner/tasks/${taskID}`)
  //       .select('title')
  //       .get();

  //   } catch (error) {
  //     console.log(error); // TypeError: failed to fetch
  //   }
  // },


  // getUserPlanners: async function getUserPlanners(accessToken, userID) {
  //   console.log('getUserPlanner')
  //   let getUserGroups
  //   try {
  //     getUserGroups = await this.getAllGroups(accessToken, userID)
  //   } catch(err) {
  //     console.log(err); // TypeError: failed to fetch
  //   }
    
  //   let planners = []

    
  //   await Promise.all(getUserGroups.value.map(
  //     async (groupInfo) => {
       
  //       if(groupInfo.displayName != 'Global Administrator'){
  //         try {
  //           const getPlanner  = await this.getAllPlanners(accessToken, groupInfo.id)
  //           if(getPlanner && getPlanner.value.length > 0){
  //             //console.log(getPlanner.value)
  //             planners.push({planner: getPlanner.value, group: groupInfo.id})
  //           }
  //         } catch(err) {
  //           console.log(err); // TypeError: failed to fetch
  //         }
  //       }
  //     }
  //   ))
  //   return planners
   
  // },

  // searchAllPlanners: async function (accessToken, userID, searchTerm){
  //   console.log('searchAllPlanners')
  //   const planners = await this.getUserPlanners(accessToken, userID)
    
  //   let plannerIDs = []
  //   let plannerTasks = []

  //   planners.forEach(plannerGroup => plannerGroup.planner.forEach(plannerInfo => plannerIDs.push({id: plannerInfo.id, group: plannerGroup.group})))
    
  //   await Promise.all(plannerIDs.map(
  //     async (plannerInfo) => {
  //         try {
  //           const getTasks  = await this.getAllTasks(accessToken, plannerInfo.id)
            
  //           getTasks.value.forEach(taskInfo => {
  //             plannerTasks.push({title: taskInfo.title, id: plannerInfo.id, group: plannerInfo.group})
  //           })

  //         } catch(err) {
  //           console.log(err); // TypeError: failed to fetch
  //         }
  //     }
  //   ))

  //   //find task
  //   console.log('Searched for task')

  //   return plannerTasks.filter( taskInfo => taskInfo.title.toLowerCase().includes( searchTerm.toLowerCase() ) )
  // },
  
}


function getAuthenticatedClient(accessToken) { // this function initializes the Graph client used to retrieve data from the msgraph api
  
  const client = graph.Client.init({
    // Use the provided access token to authenticate requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
  console.log('getAuthenticatedClient')
  return client
}
