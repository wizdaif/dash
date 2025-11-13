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

### - Roblox OAuth Application [here](https://create.roblox.com/dashboard/credentials?activeTab=OAuthTab)


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
JWT_SECRET="secret" # Change this value
API_KEY="secret" # Change this value

# Database Variables
MONGO_URI="mongodb://..."

# Discord Secrets
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
ROBLOX_OAUTH_ID=""  # Copy this from Roblox's OAuth dashboard"
ROBLOX_OAUTH_SECRET="" # Copy this from Roblox's OAuth dashboard
```


# Example Roblox Whitelist
```lua
local API_URL = "https://example.com/api/whitelist/check"

local HttpService = game:GetService("HttpService")
local GroupService = game:GetService("GroupService")
local RunService = game:GetService("RunService")

function getOwnerId(): number
	if game.CreatorType == Enum.CreatorType.Group then
		return GroupService:GetGroupInfoAsync(game.CreatorId).Owner.Id
	else
		return game.CreatorId
	end
end

local productId = "xyz"
local ownerId = getOwnerId()

if RunService:IsClient() then error("[Whitelist]: Product does not work on the client or in LocalScripts") end
if RunService:IsStudio() then error("[Whitelist]: Product does not work in Studio!") end

local url = API_URL .. `?productId={HttpService:UrlEncode(productId)}&robloxId={HttpService:UrlEncode(ownerId)}`

local success, res = pcall(HttpService.RequestAsync, { Url = url })

if success then
	if not res.Success then
		error("[Whitelist]: Invalid response from server: " .. HttpService:JSONDecode(res.Body).message)
	end

	local body = HttpService:JSONDecode(res.Body)

  if not body.data.value then
    error("[Whitelist]: Unauthorized")
  end
else
	if res == "Http requests are not enabled. Enable via game settings" then
		error("[Whitelist]: HTTP Requests are disabled")
	else
		error("[Whitelist]: Generic error: " .. res)
	end
end

-- code here
```
