> **Warning: This project is being completely re-written.**  
> **All user contributions will be transferred to the successor.**

<h1 align="center"><a href="https://adwhore.net"><img src="https://i.imgur.com/siqpaEu.png" alt="logo" width="125"></img></a></br>adwhore.net </h1>

<p align="center">
<img src="https://img.shields.io/badge/dynamic/json?label=users&query=global.users&url=https%3A%2F%2Fkarma.adwhore.net%3A47976%2FstatsMini" >
  <img src="https://img.shields.io/badge/dynamic/json?label=segments&query=global.reports&url=https%3A%2F%2Fkarma.adwhore.net%3A47976%2FstatsMini" >
  <a href = "https://chrome.google.com/webstore/detail/emfkjghgdkajicmnicojahgojkemagcm"><img src="https://img.shields.io/chrome-web-store/users/emfkjghgdkajicmnicojahgojkemagcm?label=chrome%20users"></a> 
<a href = "https://chrome.google.com/webstore/detail/emfkjghgdkajicmnicojahgojkemagcm"><img src="https://img.shields.io/chrome-web-store/rating/emfkjghgdkajicmnicojahgojkemagcm?label=chrome%20rating"></a>
<a href = "https://addons.mozilla.org/ru/firefox/addon/adwhore-net/"><img src="https://img.shields.io/amo/users/adwhore-net?label=firefox%20users"></a>
<a href = "https://addons.mozilla.org/ru/firefox/addon/adwhore-net/"><img src="https://img.shields.io/amo/rating/adwhore-net?label=firefox%20rating"></a>
<img src="https://img.shields.io/date/1596521629?label=released" >
  
</p>

**This is a browser extension designed to remove corrupted ads that YouTubers place in their videos**.

Users can easily skip known sponsor segments, submit new ones, moderate each other's contributions and compete.
<p align="center">
  <img src="https://i.imgur.com/LyEw8OZ.png" alt="ads in progress bar" width="500"></img></br>
  <b>in action</b>
</p>

**AWN** can be installed from the **[Firefox Add-ons](https://addons.mozilla.org/en/firefox/addon/adwhore-net/)** and the **[Chrome Web Store](https://chrome.google.com/webstore/detail/adwhorenet/emfkjghgdkajicmnicojahgojkemagcm)**.  

## How does it work?
<p align="center">
<b>Users report ads in videos, select its category and honesty, moderate each other's reports and compete.</br>
When you watch a video that our agents have already studied, all ad inserts will be marked so you can skip them.</b></br></br>
<img src="https://i.imgur.com/oBqAp8E.png" alt="report ad" width="500"></img></br>
<b>AWN also has a cool start & end selector</b>
</p>

<details>
  
The **acceptance level** is also being calculated for every ad.  
It depends on a blogger's previous behavior and current ad category.  

It will be higher if the blogger is honest with his audience and doesn't advertise questionable products.  
But if AWN finds out that the blogger sells his audience's trust... he will be marked as an adwhore and treated accordingly!  

If the acceptance level is below set by you, the ad will be skipped automatically.

By default, the acceptance level is 70%, and ads are skipped only if the YouTuber doesn't state an ad integration in his video.  
You can adjust settings however you want.

**ADWHORE.NET** uses an advanced reputation system to fight vandalism:  
* Server calculates the trust index for each ad to be auto skipped if the trust calculated is high enough. (set by you)
* People with a high reputation act as moderators without even knowing about it.  
* If the system detects vandalism, all user contributions and impact on other users will be eliminated using a [StalinSort](https://github.com/gustavo-depaula/stalin-sort)-like algorithm.
* Admin team checks segments from time to time to reward people with a reputation to moderate each other.

The project's primary goal is to collect information on HOW and WHAT bloggers advertise to divide them into two camps: conscientious and adwhores.

When enough data has been collected, the system will be able to identify conscientious bloggers, and the extension will alert you to bloggers who repeatedly advertised controversial products or were involved in creating their viewers for money.
</details>

## More screenshots
<details>
<p align="center">
<img src="https://i.imgur.com/RfkQTWd.png" alt="report ad" width="500"></img></br>
<b>We use category to determine if ad is acceptable.</b></br></br>
<img src="https://i.imgur.com/C2OshAA.png" alt="report ad" width="500"></img></br>
<b>Skip an ad automagically or with a simple click.</b></br></br>
<img src="https://i.imgur.com/uDAAwnr.png" alt="report ad" width="500"></img></br>
<b>Become the pathfinder. Be the hero!</br>Cool stats will arrive later!</b></br>
</p>
</details>

## History
<details>
  
I came up with this idea on May 23, 2020, when I stumbled upon a video with a drunk Russian YouTuber complaining about the platform's health.  

Many (if not all) Russian YouTubers make money through stealth advertising of really questionable products.  
YouTube doesn't pay good money, so bloggers sell people's trust for little money without caring for their reputation.  
But there are also good creative guys, but there isn't a lot of them.  

So when this guy tries to recommend something just for fun - he's always getting blamed for it because of his colleagues.  

I was looking for a new project, so I decided to create a solution for this problem: to make a way to differentiate honest YouTubers from adwhores.  

At first, I wanted to create a SocialBlade-like website where people could report such bad YouTubers so moderators can review ads and calculate trust level: if you can trust a blogger with his words. Main goal: highlight good guys in a pile of shit. So I wanted to create a support extension to show this "trust level" near the YouTuber's channel name.  
With time, this idea eventually evolved into a fully functional adblocker to separate good guys from the bad, blame bad guys with proof, and force bad guys to be better. I hope that you understood what I was trying to express :D

So I experimented with collaborative pet projects on my SA:MP script users and finally started AWN development.

July 22, 2020 - the start of active development.  
August 4, 2020 - closed alpha version.  
August 19, 2020 - public alpha release.  

TO-DO: 2020 - 2021 recap
</details>

## Differences from SponsorBlock
<details>

> [SponsorBlock](https://github.com/ajayyy/SponsorBlock) is an open-source crowdsourced browser extension to skip sponsor segments in YouTube videos.

It has gained popularity due to its transparency, open-source development, and integration with [YouTube Vanced](https://vancedapp.com/).

I have never used sponsorblock as a user, so it is not suitable for me to compare projects from the user's side.

But I still have something to mention since I have often been asked why I and the awn exist at all.

**First of all:**
* AWN is just an MVP created to test the idea.
  * It is intended to collect feedback and take them into account when developing the main project, in which the current functionality of the extension will be only a tiny part. 
  * Main problem AWN (fraudulent ads in the popular channels) is trying to solve doesn't exist in US/EU at all.
  * This project would not be complete without a chrome extension: for now, it's just an MVP written in 2 weeks.    
* SponsorBlock seems to be a mature adblocker without any hidden purpose.

As a developer, I can say that AWN and SponsorBlock have different goals, approaches to solving the problem of advertising, and substantial architectural differences.

For example, SponsorBlock is much more radical, while awn is distinguishing creative advertising from shit.
  
**For me, the ad segment blocker is just one of the means to achieve the goals of another project and not the end goal, as in the case of SponsorBlock.**

Due to some life circumstances, the development of such a big project has been delayed.  
I made a lot of mistakes while developing it.  
I'm just an amateur, but I hope I will be able to bring the main project live in 2022.  
When it is finished, the difference between my project and SponsorBlock will be obvious to remove this section.
  
As for now, if you are looking for a reliable source of ad segments, use sponsorblock. Then try my extension and give me feedback on what you disliked most :)

### Why don't you also use SponsorBlock's open database?
> SponsorBlock database is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). 

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) means that I'd had to share all my project's private segments database under the same license and promise to never make money with any of my private data because parts of it were adapted from the SponsorBlock's database.  

Ajayyy still owns his project's data and can do whatever he wants, but not me. This is not acceptable for me.

Also, simple segment bounds and sponsorblock's category are not enough for the awn to function: awn needs much more data.

I had an idea to implement the import of your own segments from the sponsorblock database into the awn's successor database in the future. To do this, you will need to know the private key of the SponsorBlock user. This will most likely be possible from a technical, ethical, and legal point of view, but it's not a priority at the moment.
</details>

## Credit
* Font Awesome by Dave Gandy - http://fontawesome.io
* Flags icons by iconPerk.com - https://www.iconfinder.com/iconsets/flags-37
* Some flags icons made by Freepik - https://www.flaticon.com/packs/countrys-flags
