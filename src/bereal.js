const axios = require("axios");

module.exports = class BeReal {
    /**
     * @constructor
     * @param {string} REFRESH_TOKEN Refresh token
     */
    constructor(REFRESH_TOKEN = null) {
        if(REFRESH_TOKEN == null) throw new Error("[BeReal] Specify the refresh token!");
        if(REFRESH_TOKEN) {
            this.options = [
                "mobile.bereal.com",
                'BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0',
                'application/json',
            ]
            this.token = REFRESH_TOKEN
        }
    }

    #get_auth() {
        return new Promise(async (resolve, reject) => {
            axios.post("https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA", {
                grantType: "refresh_token",
                refreshToken: this.token
            }, {
                'Host': "securetoken.googleapis.com",
                'User-Agent': 'FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/15.5 hw/iPhone13_3',
                'Accept': 'application/json'
            }).then(function (response) {
                if(!response.status == 200) throw new Error("Could not get token")
                return resolve(response.data.access_token)
            }).catch(function (error) {
                reject(error);
            })
        })
    }

    #api_request(method, endpoits) {
        return new Promise(async (resolve, reject) => {
            axios({
                url: `https://mobile.bereal.com/api/${endpoits}`,
                method: method,
                headers: {
                    'Host': this.options[0],
                    'User-Agent': this.options[1],
                    'Authorization': await this.#get_auth(),
                    'Accept': this.options[2],
                }
            }).then(function (response) {
                var res = response.data;
                return resolve(res)
            }).catch(function (error) {
                reject(error);
            })
        })
    }

    /**
     * Get friends feeds
     * @param {Number} limit fetch limit (max = total of your friends posts today)
     */
    async get_friends_feeds(limit) {
        if(isNaN(limit)) throw new Error("[BeReal] Limit must be a number!");
        var res = await this.#api_request("GET", "feeds/friends")
        if(limit > res.length)  throw new Error(`[BeReal] Limit must be less than or equal to ${res.length} (total of your friends posts today)!`);
        var array = []
        res.slice(0, limit).forEach(res => {
            array.push({
                username: res.userName,
                postID: res.id,
                userID: res.ownerID,
                profilePicture: res.user.profilePicture.url,
                mediaType: res.mediaType,
                UnixDate: {
                    takenAt: res.takenAt._seconds,
                    creationDate: res.creationDate._seconds,
                    updatedAt: res.updatedAt
                },
                region: res.region,
                caption: res.caption ?? "None",
                location: res.location ?? "None",
                frontCamera: res.photoURL,
                backCamera: res.secondaryPhotoURL,
                lateInSeconds: res.lateInSeconds,
                retakeCounter: res.retakeCounter,
                isPublic: res.isPublic,
                comment: res.comment,
                realMojis: res.realMojis,
                screenshots: res.screenshotsV2
            })
        })
        return array
    }   

    /**
     * Get your memories
     * @param {Number} limit fetch limit (max = total of your memories)
     */
    async get_memories_feeds(limit) {
        if(isNaN(limit)) throw new Error("[BeReal] Limit must be a number!");
        var res = await this.#api_request("GET", "feeds/memories")
        if(limit > res.data.length)  throw new Error(`[BeReal] Limit must be less than or equal to ${res.data.length} (total of your memories)!`);
        var array = []
        res.data.slice(0, limit).forEach(res => {
            array.push({
                memoryID: res.id,
                thumbnail: res.thumbnail.url,
                backCamera: res.primary.url,
                frontCamera: res.secondary.url,
                isLate: res.isLate,
                memoryDay: res.memoryDay,
                location: res.location
            })
        })
        return array
    }   

    /**
     * Get friends of friends feeds
     * @param {Number} limit fetch limit (max 10)
     */
    async get_fof_feeds(limit) {
        if(isNaN(limit)) throw new Error("[BeReal] Limit must be a number!");
        if(limit > 20)  throw new Error("[BeReal] Limit must be less than or equal 10!");
        var res = await this.#api_request("GET", "feeds/friends-of-friends")
        var array = []
        res.data.slice(0, limit).forEach(res => {
            array.push({
                postID: res.id,
                user: res.user,
                moment: res.moment,
                primary: res.primary,
                secondary: res.secondary,
                takenAt: res.takenAt,
                postedAt: res.postedAt,
                lateInSeconds: res.lateInSeconds,
                caption: res.caption ?? "None",
                location: res.location ?? "None",
                realmojis: res.realmojis
            })
        })
        return array
    }   
        
    /**
     * Get discorvery feeds
     * @param {Number} limit fetch limit (max 20)
     */
    async get_discovery_feeds(limit) {
        if(isNaN(limit)) throw new Error("[BeReal] Limit must be a number!");
        if(limit > 20)  throw new Error("[BeReal] Limit must be less than or equal 20!");
        var res = await this.#api_request("GET", "feeds/discovery")
        var array = []
        res.posts.slice(0, limit).forEach(res => {
            array.push({
                username: res.userName,
                id: res.id,
                userID: res.ownerID,
                profilePicture: res.user.profilePicture.url,
                mediaType: res.mediaType,
                UnixDate: {
                    takenAt: res.takenAt._seconds,
                    creationDate: res.creationDate._seconds,
                    updatedAt: res.updatedAt
                },
                region: res.region,
                caption: res.caption ?? "None",
                location: res.location ?? "None",
                frontCamera: res.photoURL,
                backCamera: res.secondaryPhotoURL,
                lateInSeconds: res.lateInSeconds,
                retakeCounter: res.retakeCounter,
                isPublic: res.isPublic,
                comment: res.comment,
                realMojis: res.realMojis,
                screenshots: res.screenshotsV2
            })
        })
        return array
    }   

    /**
     * Get sent friends requests
     */
    async get_sent_friend_requests() {
        return (await this.#api_request("GET", "relationships/friend-requests/sent")).data
    }   

    /**
     *  Get receive friends requests
     */
    async get_received_friend_requests() {
        return (await this.#api_request("GET", "relationships/friend-requests/received")).data
    }   

    /**
     * Search users
     * @param {String} username username you want to search
     */
    async search_username(username) {
        if(typeof username !== "string") throw new Error("[BeReal] Username must be a string!");
        return (await this.#api_request("GET", `search/profile?query=${username}`)).data
    }   
        
    /**
     * Get posts's realmojis
     * @param {String} post_id post id
     */
    async get_reactions(post_id) {
        if(typeof post_id !== "string") throw new Error("[BeReal] Post ID must be a string!");
        return (await this.#api_request("GET", `content/realmojis?postId=${post_id}`)).data
    }   

    /**
     * Get friends suggestions
     */
    async get_friends_suggestions() {
        return (await this.#api_request("GET", "relationships/suggestions")).data
    }   

    /**
     * Get today's photos from your friends
     */
    async get_friends_pics() {
        var res = await this.#api_request("GET", "feeds/friends")
        var array = []
        res.forEach(res => {
            array.push({
                username: res.userName,
                profilePicture: res.user.profilePicture.url,
                mediaType: res.mediaType,
                frontCamera: res.photoURL,
                backCamera: res.secondaryPhotoURL
            })
        })
        return array
    }

    /**
     * Get friends
     */
    async get_friends() {
        return (await this.#api_request("GET", "relationships/friends")).data
    }

    /**
     * Get friends who got location 
     */
    async get_friends_with_location() {
        var res = await this.#api_request("GET", "feeds/friends")
        var array = []
        res.forEach(res => {
            if(res.location) {
                array.push({
                    username: res.userName,
                    region: res.region,
                    location: res.location
                })
            }
        })
        return array
    }

    /**
     * Get a user profile
     * @param {String} userID User ID
     */
    async get_user_profile(userID) {
        if(typeof userID !== "string") throw new Error("[BeReal] UserID must be a string!");
        return this.#api_request("GET", `person/profiles/${userID}`)
    }

    /**
     * Get your user info
     */
    async get_user_info() {
        return this.#api_request("GET", "person/me")
    }
}

