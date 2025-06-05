---
permalink: /posts/
title: Posts
subtitle: The Indra.ai posts section is a dynamic platform where insightful blogs and articles are shared, offering readers a deep dive into the world of artificial intelligence and technology.
layout: posts
background: /assets/posts/background.png
image: /assets/posts/image.png
avatar: /assets/posts/avatar.png
emoji: /assets/posts/emoji.png
color: var(--color-white)
bgcolor: var(--color-darkest-grey)
describe: The new Indra.ai posts section is a dynamic platform where insightful blogs and articles are shared, offering readers a deep dive into the world of artificial intelligence and technology. This section serves as a hub for thought leadership, featuring expert opinions, latest trends, and innovative ideas that drive the AI industry forward.
tweet: The new Indra.ai posts section is a dynamic platform where insightful blogs and articles are shared, offering readers a deep dive into the world of artificial intelligence and technology.
hashtags: QuinnMichaels,IndraAI,DevaWorld,IndraPosts
---

<section class="posts">
	{% for post in site.posts %}
		<article class="post">
			<div class="info">
				<h3><a href="{{ post.url }}">{{post.title}}</a></h3>
				<div class="date">{{post.created | date: "%B %d, %Y"}}</div>
				<div class="excerpt">
					{{post.excerpt}}
				</div>
			</div>
		</article>
	{% endfor %}
</section>
