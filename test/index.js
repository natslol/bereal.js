require('dotenv').config();
const BeReal = new (require("../src/bereal.js"))(process.env.REFRESH_TOKEN)

BeReal.get_friends_feeds(15).then(res => {
    console.log(res)
})

BeReal.get_memories_feeds(1).then(res => {
    console.log(res)
})

BeReal.get_fof_feeds(10).then(res => {
    console.log(res)
})

BeReal.get_discovery_feeds(1).then(res => {
    console.log(res)
})

BeReal.get_sent_friend_requests().then(res => {
    console.log(res);
})

BeReal.get_received_friend_requests().then(res => {
    console.log(res);
})

BeReal.search_username("username").then(res => {
    console.log(res);
})

BeReal.get_reactions("postid").then((res) => {
    console.log(res);
})

BeReal.get_friends_suggestions().then(res => {
    console.log(res);
})

BeReal.get_friends_pics().then(res => {
    console.log(res);
})

BeReal.get_friends().then(res => {
    console.log(res);
})

BeReal.get_friends_with_location().then(res => {
    console.log(res);
})

BeReal.get_user_profile("userid").then(res => {
    console.log(res);
})

BeReal.get_user_info().then(res => {
    console.log(res);
})






