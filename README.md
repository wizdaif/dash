# dash 

A free and simple solution to running your own purchase hub for Roblox.
    


## Note

This is a work in progress - The roblox counterpart of this *might* be released, probably not though

Questions? Contact me on discord [@justj2](https://discord.com/users/404493829249433600) or email at [jayden@jae.quest](mailto:jayden@jae.quest)


## Related Services

Other services that do all of this and more:

[Parcel](https://parcelroblox.com/)   
[myPod](https://discord.gg/podtech)  
[dash (coming soon)](https://jae.quest)  


## Run Locally

Clone the project

```bash
  git clone https://github.com/wizdaif/dash
```

Go to the project directory

```bash
  cd dash
```

Install dependencies

```bash
  npm install
```

Configure Required Files
- Edit .env file with this template
```env
DISCORD_TOKEN=bot token here
CLIENT_ID=bot client id here
CLIENT_SECRET=bot client secret here
APP_URI=app url here
API_KEY=api key here
MONGODB_URI=mongodb url thing here
```
- Edit configuration.ts with this template
```ts
export const config = {
    allowedIds: [''] // this will set who can access the web dashboard
    // other stuff here idk
}
```

Start the server

```bash
  npm run start
```