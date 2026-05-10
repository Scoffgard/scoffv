# ScoffV
ScoffV is a multiplayer server on RageMP.<br>
**The project is still on development.**

For informations on the sub projects (CEF, discord, etc...) check they respective README.md

# Setup
**All the following steps are mandatory and should be done before first launch for the server to work**

Create a database for the server (only MySQL supported). Then run the sql file : `baseDatabase.sql`

The create the file `.env` in the root directory of your server and populate it as follows :
```env
WS_TOKEN=<secure token to communicate with discord bot, needs to be the same as ./discord/.env>
DB_HOST=<uri of your mysql database>
DB_USER=<username to connect to your mysql database>
DB_PASS=<password to connect to your mysql database>
```

# Disclaimers
> Grand Theft Auto and Grand Theft Auto: V are registered trademarks of Take-Two Interactive Software. All trademarks used are the property of their respective owners. Me and this project are not affiliated with or endorsed by Rockstar Games, Take-Two Interactive Software or other rightsholders. I do not host any user-generated servers and are not responsible for any user-generated content. All user-generated content is the property of its respective owners.

> This project is not associated with RageMP or the RageMP Team. For any informations on RageMP, check their website here : [RageMP](https://rage.mp)

# Credits
This project is heavily inspired by **[Kaniggel](https://github.com/MyHwu9508)** and **[tomatenbaumful](https://github.com/tomatenbaumful)** project's : **[PlayVFreeroam](https://github.com/MyHwu9508/PlayVFreeroam)**. Credit has to be given to them for they incredible work.

---
Made with ❤️ by Scoffgard