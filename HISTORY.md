> **Please don't judge me for English is not my native language.**

# History.
**In this file, I am writing a chronicle of the development of the project.**

I don't fully understand why I'm doing this, but my project doesn't have a regular website or blog yet, so let it be so for now.

If you are interested in how the project appeared, what difficulties I met on my way, maybe you should try to read my writings.  

Otherwise, you shouldn't read this.  

There are a lot of words: I am known for not being able to summarize my thoughts.  
## Background and inspiration.

When I studied software engineering at [SPbPU](https://en.wikipedia.org/wiki/Peter_the_Great_St._Petersburg_Polytechnic_University) in 2019, some courses involved online tests which nobody wanted to waste time on.  
Students were sharing answers to these tests in special VK groups. In addition, there were sites with bulky tables with these answers.  
It was highly inconvenient since the tests were made up of a massive set of questions, making them almost unique for every student. 
  
Someone decided to automate this process: he created a browser extension that automatically filled up the database with answers to questions captured from the interface of the educational platform. It was enough for one user to pass the test so that the correct answers would get into the database. The rest users would not have to waste their time on courses that were not interesting for them.

The extension became wildly popular at the university, receiving several thousand active users in a few weeks.

There were also funny counteractions from the developers of the [SPbPU's online educational platform](http://www.edu.spbstu.ru/).  
They tried to identify the extension users and redirect them to a PDF document containing a template 'please expel me from the university, while the extension developer tried to make his extension usage as inconspicuous as possible.

As far as I remember, it all ended with the university management putting pressure on the developer, and he removed the extension.

**At that time, the project didn't impress me much.**  

**In fact, I had already created similar projects.**  

---

In May 2018, I helped to improve one of the most popular [SA:MP](https://sa-mp.com/) moonloader modifications ever: [TruckHud](https://github.com/Serhiy-Rubin/TruckHUD).

It is intended for truckers who transport goods and need to know what prices are at the delivery points to know where to go to earn more money.  

Since these prices are constantly changing and can only be viewed at the points of purchase/delivery of goods, the truckers drove blindly on the trip. The problem was is that they didn't know the current situation in the in-game market.  

The script helped truckers to exchange up-to-date information about these prices among themselves.

---

A year before a story with this university extension happened, I created a private SA:MP script for my playmates.  
It is used to exchange our coordinates in a big game map and share additional helpful information for a small community.  

Parts of this private project moved to the public [gmap](https://github.com/qrlk/gmap), which has not gained much love among the players.

---

During covid isolation, I listened to a [podcast](https://mybook.ru/author/andrash-gusti/kirill-kudin-wifi-map-kak-sozdat-komyuniti-i-zarab/) with the author of [WiFi Map](https://www.wifimap.io/), an application that collects data from users about WiFi points with passwords known to the public.  

**I was amazed that people are ready to share useful data when they feel part of something bigger and get a convenient service for themselves.**  

Most of all, I was surprised by the property of human nature, which can be used not only for useless computer games but also for solving real-life problems affecting many people.

## May 23, 2020 — the project's concept is born.  

I stumbled upon a video with a drunk Russian YouTuber complaining about the platform's health.  

Many (if not all) Russian YouTubers make money through stealth advertising of really questionable products.  
YouTube doesn't pay good money, so bloggers sell people's trust for little money without caring for their reputation.  
In the CIS, it is common to see hidden sponsored fraudulent advertising on a channel with millions of views.

But there are also good principle creative YouTube creators, but there isn't a lot of them.  

So when this guy tries to recommend something just for fun - he's often getting blamed for it because of his colleagues.  

It was an extraordinary time of covid-19 isolation in St. Petersburg.  
No one knew what to expect, universities switched to remote education, and I was just looking for something to do.

So I decided to create a solution: find a way to distinguish honest YouTubers from adwhores.
  
At first, I wanted to create a SocialBlade-like website.  
The idea was to allow people to report such bad YouTubers so moderators can review ads and calculate trust level: if you can trust a blogger with his words.  

Primary goal: create something like 'Social Credit System', but for Influencers whose public statements are subject to audit.  

I wanted to also create a support browser extension to show this "trust level" near the YouTuber's channel name.  
With time, this idea eventually evolved into a fully functional adblocker.  

I decided to test this concept with SA:MP mod.  
I created a [collaborative SA:MP pet project](https://github.com/qrlk/locator) for in-game car thieves to share need-to-steal vehicle locations between each other.

When I realized that my goal with YouTube is possible to achieve — I finally started AWN development.

## July 22, 2020 — the start of active development.

Creating a collaborative AdBlock seemed a pretty trivial task for me.  
I hoped that due to the lack of serious competition, I would quickly develop a user base, build a core full-fledged web project and rush into a bright future.  
I already had a concept of what I needed to do for an MVP in my head.  
A month of reflection and a lot of experience in developing pet projects helped me a lot.  

I had almost 0 experience working with HTML/JS/CSS and creating a database/API web application.  
It took only a week to move the project from my head to the MVP state.  

It was a fun experience.

## August 4, 2020 — closed alpha version.  

I needed some users to gather initial feedback, so I appealed to a loyal user base.  
I created [theme on a SA:MP cheat forum](https://www.blast.hk/threads/61152/), which I used to promote my game modifications in the past.  

I received a lot of feedback from the forum users and spent a week correcting the grossest mistakes.

I have published my extension in the Chrome Web Store and Mozilla add-ons.  

Opera Add-ons still hasn't accepted my extension. I still don't know why.

~400 ad segments from ~50 users were submitted to the awn database during the closed alpha, which saved ~16 hours at that moment.

I decided to publish it to a broader audience when the extension was ready for the mass user (it was not ready at all, but I didn't know that yet).  
Chrome Web Store moderation process took another week of my life, and when the fixed version was finally published - I moved to the next stage.  

## August 19, 2020 — public alpha release.  
**For the public alpha, I needed more users.**  

**As I didn't have any marketing budget, I decided to promote my extension on the Internet for free.**  

### I created posts a list of resources on which I could feature my project for free:

* **HackerNews**
  * [Show HN](https://news.ycombinator.com/item?id=24211486)
* **reddit.com**
  * [/r/opensource/](https://www.reddit.com/r/opensource/comments/icmgku/im_working_on_adwhorenet_an_open_source_browser/)
  * [/r/coolgithubprojects/](https://www.reddit.com/r/coolgithubprojects/comments/icn7o1/adwhorenet_is_a_browser_extension_for_youtube_not/)
  * [/r/firefox/](https://www.reddit.com/r/firefox/comments/ico9u1/ive_made_a_firefox_extension_which_skips_bad/)
  * [/r/youtube/](https://www.reddit.com/r/youtube/comments/icocql/ive_made_a_browser_extension_which_skips_bad/)
  * [/r/youtubers/](https://www.reddit.com/r/youtubers/comments/icphyb/tips_tricks_you_should_start_adding_includes_paid/)
  * [/r/piracy/](https://www.reddit.com/r/Piracy/comments/icq0gj/ive_made_extension_for_youtube_to_skip_sponsored/)
  * [/r/uBlockOrigin/](https://www.reddit.com/r/uBlockOrigin/comments/icq4ln/ive_made_a_browser_extension_to_skip_sponsored_by/)
* **pickabu.ru**
  * [Russian Reddit clone](https://pikabu.ru/story/adwhorenet__blokiruem_reklamu_blogerov_na_youtube_7660595)
* **dtf.ru / vc.ru**
  * Couldn't register and post due to error 500
* **VK**
  * My own [SA:MP VK group](https://vk.com/qrlk.mods?w=wall-168860334_212)
  * Loyal [rubin.mods VK group](https://vk.com/rubin.mods?w=wall-161589495_4478)

I decided to throw it on the Internet and see what happens.  
In the case of Reddit, I used [this service](https://dashboard.laterforreddit.com/analysis/) to determine the optimal time for a post.  
I didn't devote enough time to the presentation of the project. Therefore, I did not believe that my project would be able to attract at least some attention.

For most of my posts, this turned out to be true.  
I either got downvoted, didn't attract enough attention, or was banned, or couldn't even register on the site due to technical problems (dtf.ru, vc.ru).

But I have no reason to complain: I did not read the rules of subreddits and my titles in part of them were an apparent provocation.

### However, I consider 4/13 attempts to attract attention as successful.

* **My post on [pickabu.ru](https://pikabu.ru/story/adwhorenet__blokiruem_reklamu_blogerov_na_youtube_7660595) was viewed 70K times and received 1191 upvotes.** 
  * It attracted enough attention to get the essential feedback from Russian boomers.
  * I received the first 500 Russian-speaking users on the first day.
  * I was later featured along with the SponsorBlock [here](https://pikabu.ru/story/antologiya_blokirovki_reklamyi_2020_pk_telefon_android_iphone_pochta_yandeksa_i_mailyoutube_yandeks_direktxiaomi_7663515) (300K) and [here](https://pikabu.ru/story/avtopromatyivanie_reklamyi_v_rolikakh_youtube_vanced_7853040) (~20k after upd).
* **My post on [HackerNews](https://news.ycombinator.com/item?id=24211486) got 3 points.**
  * A single 300 character neutral comment on HackerNews gave me more constructive criticism than anywhere else at that moment.
* **My post on [/r/opensource/](https://www.reddit.com/r/opensource/comments/icmgku/im_working_on_adwhorenet_an_open_source_browser/) was upvoted 186 times.**
  * I received criticism of the extension name, unexpected concerns about the transparency of the project, and understanding that I need to move in a different direction.
* **My post on [/r/piracy/](https://www.reddit.com/r/Piracy/comments/icq0gj/ive_made_extension_for_youtube_to_skip_sponsored/) was upvoted 2699 times.**
  * The strangest thing is that Reddit attracted attention where I least expected it. I guess provocative naming and the proper title worked.
  * I didn't get many users from Reddit, but I realized that I can't express my thoughts clearly in English, and I need to work on it.
  * I got a lot of constructive criticism and non-constructive nonsense, which is also helpful for understanding how people react to the product.
  * I've also heard a lot of conspiracy theories about how I plan to make money by forcing users to watch ads they're not interested in.
  * **But the most important thing is that I realized that my product in its current form had no potential in the Western market.**

**Public Alfa revealed a lot of problems that I overlooked on the closed alpha.**  

For example, due to a backend error, about a quarter of new users could not register and use the extension.

---
### SponsorBlock API removal.

After my trip to the Reddit comments, Ajay (SponsorBlock's maintainer) reached me on e-mail.  
He asked me to publicly release a part of my database in a form similar to the SponsorBlock's database or remove usage of the SponsorBlock's API.  

The closed alpha version of AWN had an optional SponsorBlock API usage (disabled by default) to fetch segments and submit them to the AWN database when added necessary data.

I removed the SponsorBlock API usage and all segments that were adapted from it by AWN's users.

Even though my users and I obviously suffer from a lack of the SponsorBlock's DB usage, I think that my project should stay independent.  

As my in-development project is not limited to sponsor segment skipping but still relies on community contributions, I want to show my users that they can easily participate in the project's life: adding a sponsored segment is easiest.

I don't like the idea of making a submission database publicly available.  However, I understand that this is one of the main advantages of SponsorBlock from the point of view of the open-source community.

---

The experience with the publication led me to the opinion that the extension needs serious revision before it would be possible to proceed to the development of the main project.

I spent the remaining week and a half of August fixing bugs and fixing the UI interface.

## September 2020.

**September was the most productive and the most destructive month for the project in 2020.**

I redesigned the install page (First-Run wizard), reworked the community self-regulation system, added the ability to edit timecodes, replace segments and submit reports to delete segments.  
I also implemented the moderator interface and its functionality, modified the interface for adding new segments, added new shortcuts, manually reviewed 2000+ advertising segments, added support for chapters, and much more.

I also updated the [adwhore.net website](https://adwhore.net). I filled out the [Russian section of the GitHub wiki](https://github.com/qrlk/adwhore.net/wiki/Home-%28Russian%29), but I didn't manage to finish it at that moment.

I also killed a massive amount of time and nerves trying to register in the Apple developer program.  
At that time, Apple did not accept automatic applications from developers from Russia due to some internal processing error. Unfortunately, it didn't work out to publish my project in the App Store to meet the release of a new version of Safari (with support for chrome API extensions), and their support simply ignored me.

However, my extraordinary passion for developing this project did not go unpunished — **I was expelled from the university**.  

I ignored the fact that a challenging exam, for which I had only one attempt, was unexpectedly scheduled for the next few days to be taken in person when everything else was taken remotely.  
My e-mail provider [was under constant DDOS attackes](https://tutanota.com/blog/posts/ddos-attack-update/) in September, so I stopped checking it at some point and missed an important e-mail.  

I had enough time to prepare for this exam in the summer.  
Still, I preferred to continue my work on the extension since it was positively received, and I was sure that the exam would be postponed for the winter because of the covid-19.

The expulsion from the university greatly affected my financial condition and health.  
Moreover, it was morally difficult for me to continue active development after being pulled out of my usual work environment.  
Therefore, the AWN ironically became one of the reasons for my expulsion.

I realized that I would need much more strength and resources than I could allocate in that state to complete my project.

I moved into a rented apartment from the dorm and decided to take a break from everything.

## October 2020 — Lazy mode.

In mid-October, I tried to return to the development of the project.

I made a lot of cosmetic changes with the extension and improved the performance of its server.

I also implemented a lazy mode - adding sponsor segments without specifying their category and other criteria that the awn needs. 

Another user can supplement such a segment if the system's level of trust in it is higher than that of the author of the original segment.

Despite a month of rest from active development, I was still thinking about the project, and it didn't really help me get away from it.

I decided that to ensure the long-term development of a full-fledged web project, I needed to rest much more and do other things.

I stopped the project's development, limiting support to urgent fixes and moderating complaints about incorrect segments.

## February 2021 - September 2021 — Insanity.
### Goal.
At the beginning of the project, I hoped to earn the support of some principled youtube influencers who could help promote the extension in exchange for the opportunity to use the project database to create video content.  

Some people from Reddit perceived this concept as taking money from YouTubers so that the extension would not skip their sponsored segments. I can't wait for YouTubers to start sending me suitcases of cash so that 5-10 people have to click on the right arrow five times.

When I decided to take a break from development, I had a lot of free time.  
I decided to spend it to try to attract a loyal audience on YouTube on my own.  

Such an experience would help me understand the inner side of creating entertainment content on the Internet, making valuable acquaintances, and getting out of the depression I have driven myself into.  
All this could ultimately help my main project.
### Idea.
I was looking for some unpopular but promising entertainment format suitable for YouTube, live streams, and short videos for TikTok.  
I needed to have some kind of advantage that could set me apart from the rest of the content creators and give me trumps.  

The answer came unexpectedly: in February, my friend in discord, for no reason, turned on his webcam in a server in which it was not expected.  
I wanted to make a joke: capture an image from a webcam and display it on my camera in discord. So I found [obs-virtual-cam](https://github.com/Fenrirthviti/obs-virtual-cam), and I carried out my plan. 

The joke turned out to be not funny, so I decided to go further: take my friend to some webchat and speak instead of him.  

The choice fell on [videochatru.com](https://videochatru.com), but for some reason, my virtual camera was not displayed in the list of devices.  

Roughly understanding the limitations of the web browser in working with hardware, I started looking for ways to get around it.  

I just changed the camera name in the registry, and everything started working. 

I mirrored the image from the interlocutor's camera and looked at the reaction. The reaction was very, very strong. At that moment, I realized that I had found something.

The next step was to connect the interlocutors with each other.  
### Software.
Creative interference in conversations caused funny and sometimes absurd situations.
It turned out that such a format had already been presented on YouTube. Still, it was not so widespread and, from my point of view, implemented without imagination.  

As an expelled software engineering student, I created specialized software for pranks in chat roulette.  
The idea was to create something valuable for myself that could be exchanged for PR of my channel by already active chat roulette prankers.  

I spent a lot of time creating a solution that would use only browser extensions: limiting myself to two browsers with extensions communicating via webrtc.  
Due to some chrome bugs and, in principle, significant webrtc delays, nothing usual happened.  
With the help of an [electron](https://github.com/electron/electron), a desktop solution was created very quickly. Still, there was a dependence on OBS and Voicemeeter Potato.  

In the end, two products turned out: a **[browser extension](https://github.com/qrlk/videochatru-extension)** and an **[electron application](https://github.com/qrlk/videochatru-mitm)**.

<p align="center">
  <img src="https://raw.githubusercontent.com/qrlk/videochatru-mitm/main/screens/screen.gif" ></img></br>
  <b><a href = 'https://github.com/qrlk/videochatru-mitm'>videochatru-mitm</a> perfoming a simple <a href = 'https://en.wikipedia.org/wiki/Man-in-the-middle_attack'>mitm attack</a> on <a href = 'https://videochatru.com'>Chatruletka</a></b>
</p>

### Abandonment.

I started experimenting with this format in closed discord communities.  
For all the time, I have devoted 40-50 people to the process to get feedback and ideas.

The result was very positive. I think many people would have found it interesting, and my channel would have grown quickly, and everything would have turned out in the end.  
I could even develop projects in Russian and English in parallel.

**The problem was legal:**  
* Pranks on the Internet have always been in the gray zone of the law.  
* It is impossible to make exciting pranks without provocations and light violations of the law.  
* There are a lot of children in chat roulette, hate speech.
* The most successful content among a closed audience could not be published at all because of 18+.

I was stalling for time, gathering more streaming experience in small communities, acquiring video editing skills, and still couldn't decide whether I should take the risk.

My fears were greatly influenced by the story with Yuri Khovansky, one of the pioneers in the Russian segment of YouTube.  
In June, he was arrested on charges of justifying terrorism for a provocative song performed many years ago. 

<p align="center">
  <img src="https://i.imgur.com/wam2c62.png" height=400></img></br>
  <b>arrest of yuri khovansky</b>
</p>

Yuri was known for his conflicts with other bloggers.  
His opponents eventually decided to use their media influence to attract the authorities' attention to his offense to easily take him down.

If the primary goal of this project was not to promote an anti-advertising project, I would have been just publishing pranks for a long time and earning money with VPN advertising.

**But the whole thing had one massive problem: adwhore.net.**  
My project could cause a significant adverse reaction from the community of YouTube bloggers.

Finally, my fears seemed to me as justified as possible, and I abandoned the development of the YouTube project in August 2021.  

### Aftermath.

**I was offended that I wasted so much time.**  
But it wasn't so bad: I was finally able to rest and get back to programming.  

I decided to bring my software projects at least to some acceptable form later.

**In September 2021, I published my Chatruletka projects:**

* **[videochatru-extension](https://github.com/qrlk/videochatru-extension)**
  * This is a browser extension that adds a bunch of cool stuff to the **[Chatruletka website](https://videochatru.com/)**.
* **[videochatru-mitm](https://github.com/qrlk/videochatru-mitm)**
  * This is an advanced desktop **[Chatruletka (ome.tv)](https://github.com/qrlk/videochatru-extension#what-is-chat-roulette)** client which is focused on the needs of YouTubers.
  * It has the ability to connect interlocutors with each other and interfere in their conversations.

## October 2021
I haven't done anything useful for awn, but I've started playing with the technologies I want to use to implement the awn successor.

## November 2021
**Currently, I'm returning to the active development full of energy and new ideas.**  

**I want to apologize to all my active users who have added 13k+ sponsor segments to the project database during my inactivity.**  

I think that the best way to apologize for a year of inactivity is to continuously work on a project for a year and more.

Now just fight till the end...
