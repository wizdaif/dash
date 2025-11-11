# dash 

A free and simple solution to running your own purchase hub for Roblox.
    
## Credits
  - lavylavender!!! (bot framework was based off of previous code)

## Note

This is a work in progress & a free version of my paid service - I will not be releasing the roblox counterpart for this

Questions? Contact me on discord [@justj2](https://discord.com/users/404493829249433600) or email at [jayden@adyptive.co](mailto:jayden@adyptive.co)


## Related Services

Other services that do all of this and more:

[Parcel](https://parcelroblox.com/)   
[myPod](https://discord.gg/podtech)  
[Vault](https://vaultroblox.com)  
[pulse (coming soon)]()  

# Prerequisites

### - Install bun [here](https://bun.sh/)

### - Create Discord Bot [here](https://discord.com/developers/)
> Example Permissions: https://prnt.sc/5x2PfYVX0EKF


# Running the project

Clone the project

```bash
  git clone https://github.com/wizdaif/dash
```

## Run Locally (Standalone)

Enter the server directory

```bash
  cd dash/server
```

Install dependencies

```bash
  bun install
```

Configure Required Files
- Edit the server/.env file with this template
```env
# Application Variables
PORT=3000

# Database Variables
MONGO_URI="mongodb://..."

# Discord Secrets
DISCORD_OAUTH_CLIENT_ID="..." # Copy this from the Discord Developer dashboard
DISCORD_TOKEN="..." # Copy this from the Discord Developer dashboard

# Discord Guild Variables
GUILD_ID="..." # Required
ADMIN_ROLE_ID="..." # Used for bot / dashboard. if not provided only owner can manage 
PURCHASE_LOGS_CHANNEL_ID="" # If not provided, it will either find or create a channel named "purchase-logs"
```

Start the server

```bash
  bun run start
```

Enter the website directory

```bash
  cd ../website
```

Install dependencies

```bash
  bun install
```

Configure Required Files
- Edit the website/.env file with this template
```env
PORT=5555
APP_URL="http://localhost:5555"
SERVER_URL="http://localhost:3000"
DISCORD_OAUTH_CLIENT_ID="..." # Copy this from the Discord Developer dashboard
DISCORD_OAUTH_CLIENT_SECRET="..." # Copy this from the Discord Developer dashboard
```
