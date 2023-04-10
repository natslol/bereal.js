require('dotenv').config();
const BeReal = new (require("../src/bereal.js"))(process.env.REFRESH_TOKEN)

BeReal.get_user_info().then(res => {
    console.log(res);
})

/* EXAMPLE OUTPUT
{
  id: 'userid',
  username: 'username',
  birthdate: '2000-01-01T00:00:00.000Z',
  fullname: 'Fullname',
  profilePicture: {
    url: 'url',
    width: 500,
    height: 500
  },
  realmojis: [],
  devices: [
    {
      clientVersion: '0.65.0',
      device: 'Redmi 21061119DG Android 12',
      deviceId: '3bd19b9cd9aa6a96',
      platform: 'android',
      language: 'fr',
      timezone: 'Europe/Paris'
    }
  ],
  canDeletePost: true,
  canPost: true,
  canUpdateRegion: true,
  phoneNumber: '+33612345678',
  biography: "Who is god,
  location: 'Here',
  countryCode: 'FR',
  region: 'europe-west',
  createdAt: '2022-09-13T21:11:53.449Z'
}
*/