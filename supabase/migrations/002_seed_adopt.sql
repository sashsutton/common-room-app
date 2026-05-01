-- Seed data for ADOPT themes
-- 39 themes across 5 categories, sourced from ADOPT_DATABASE_280426.xlsx
-- category_colour matches constants/theme.ts CategoryColors

insert into adopt_themes (category, theme, description, third_person_description, category_colour) values

-- Creativity, culture and legacy
('Creativity, culture and legacy', 'Artistic expression', 'I find meaning through creating and making things that reflect who I am.', 'This person draws deep satisfaction from creative work as a form of self-expression and communication.', '#E6CFF1'),
('Creativity, culture and legacy', 'Cultural identity', 'My heritage and cultural roots are an important part of who I am.', 'This person places significant value on their cultural background as a source of identity and belonging.', '#E6CFF1'),
('Creativity, culture and legacy', 'Legacy and impact', 'I want to leave something meaningful behind for others.', 'This person is motivated by the desire to contribute something lasting to their community or the world.', '#E6CFF1'),
('Creativity, culture and legacy', 'Learning and curiosity', 'I am energised by discovering new ideas and expanding my knowledge.', 'This person is intellectually curious and finds joy in lifelong learning across many domains.', '#E6CFF1'),
('Creativity, culture and legacy', 'Storytelling and narrative', 'I make sense of my life and the world through stories.', 'This person uses narrative as a primary way of understanding experience and connecting with others.', '#E6CFF1'),
('Creativity, culture and legacy', 'Writing and language', 'Words are one of my most important tools for thinking and connecting.', 'This person has a deep relationship with written and spoken language as a mode of expression and thought.', '#E6CFF1'),
('Creativity, culture and legacy', 'Music and sound', 'Music is a central part of how I experience and express emotion.', 'This person has a profound connection to music and sound as a form of emotional and creative outlet.', '#E6CFF1'),

-- Health and wellbeing
('Health and wellbeing', 'Body and movement', 'My physical wellbeing and how I move through the world matter to me.', 'This person understands their physical health as foundational to their overall sense of vitality.', '#A7D7C5'),
('Health and wellbeing', 'Mental and emotional health', 'I pay attention to my inner emotional life and how I manage it.', 'This person actively attends to their psychological and emotional wellbeing as a priority.', '#A7D7C5'),
('Health and wellbeing', 'Rest and restoration', 'I need space and quiet to recharge and feel well.', 'This person recognises the importance of rest, solitude, and restoration for their functioning.', '#A7D7C5'),
('Health and wellbeing', 'Nature and environment', 'Being in nature restores something essential in me.', 'This person feels a strong connection to the natural world and finds renewal in natural spaces.', '#A7D7C5'),
('Health and wellbeing', 'Nourishment and care', 'How I care for my body through food and daily rituals matters to me.', 'This person takes intentional care of their physical self through mindful nourishment and daily practice.', '#A7D7C5'),
('Health and wellbeing', 'Presence and mindfulness', 'I value being fully present in my life rather than lost in thought.', 'This person cultivates awareness of the present moment as a way of living more fully.', '#A7D7C5'),

-- Lifework and resilience
('Lifework and resilience', 'Ambition and achievement', 'I am driven to accomplish things that challenge me and prove what I can do.', 'This person is motivated by setting high goals and working hard to reach them.', '#C1C8E4'),
('Lifework and resilience', 'Autonomy and independence', 'Being in control of my own time and choices is deeply important to me.', 'This person needs freedom and self-direction in order to feel fulfilled.', '#C1C8E4'),
('Lifework and resilience', 'Change and adaptability', 'I can navigate uncertainty and adapt when things shift around me.', 'This person is comfortable with change and able to flex when life takes unexpected turns.', '#C1C8E4'),
('Lifework and resilience', 'Craft and mastery', 'I find deep satisfaction in becoming genuinely skilled at something.', 'This person is oriented toward excellence and the gradual development of expertise.', '#C1C8E4'),
('Lifework and resilience', 'Entrepreneurship and initiative', 'I am energised by building things from scratch and taking calculated risks.', 'This person is drawn to creating new ventures and taking responsibility for outcomes.', '#C1C8E4'),
('Lifework and resilience', 'Financial security', 'Feeling financially stable gives me the foundation to pursue everything else.', 'This person sees financial wellbeing as a precondition for other aspects of a good life.', '#C1C8E4'),
('Lifework and resilience', 'Leadership and influence', 'I naturally take charge and feel purposeful when guiding others toward a goal.', 'This person finds meaning in directing and inspiring others toward shared objectives.', '#C1C8E4'),
('Lifework and resilience', 'Problem-solving and strategy', 'I am energised by working through complex challenges and finding effective solutions.', 'This person excels at analytical thinking and enjoys the process of untangling difficult problems.', '#C1C8E4'),
('Lifework and resilience', 'Purpose and vocation', 'I am searching for work that feels deeply meaningful and aligned with who I am.', 'This person is motivated by a sense of calling and wants their work to reflect their core values.', '#C1C8E4'),

-- Relationships and belonging
('Relationships and belonging', 'Community and belonging', 'Being part of something larger than myself gives my life meaning.', 'This person finds deep significance in being connected to a community or shared endeavour.', '#F6B5B5'),
('Relationships and belonging', 'Family and caregiving', 'My relationships with family — chosen or given — are central to who I am.', 'This person draws their deepest sense of meaning from familial bonds and the act of caring for others.', '#F6B5B5'),
('Relationships and belonging', 'Friendship and connection', 'Close friendships and genuine human connection nourish me.', 'This person thrives through deep personal friendships and values authentic connection above status or success.', '#F6B5B5'),
('Relationships and belonging', 'Intimacy and partnership', 'Being known and knowing another person deeply matters to me.', 'This person places great importance on the experience of deep mutual understanding and closeness.', '#F6B5B5'),
('Relationships and belonging', 'Service and contribution', 'I feel most alive when I am doing something genuinely useful for others.', 'This person is motivated by the desire to contribute to the welfare of those around them.', '#F6B5B5'),
('Relationships and belonging', 'Social justice and equity', 'I care deeply about fairness and I want to act on that care.', 'This person is oriented toward the pursuit of a fairer world and feels a duty to challenge injustice.', '#F6B5B5'),
('Relationships and belonging', 'Trust and loyalty', 'Being someone others can rely on is a core part of how I see myself.', 'This person holds integrity and dependability as foundational personal values.', '#F6B5B5'),

-- Self development and inner growth
('Self development and inner growth', 'Authenticity and integrity', 'Living in alignment with my true values is non-negotiable for me.', 'This person places integrity at the centre of their identity and feels deeply uncomfortable when out of alignment.', '#F5DEB3'),
('Self development and inner growth', 'Courage and risk-taking', 'I want to be someone who acts despite fear, not in the absence of it.', 'This person understands growth as requiring the willingness to step into uncertainty.', '#F5DEB3'),
('Self development and inner growth', 'Faith and spirituality', 'A sense of something beyond the material gives my life depth and meaning.', 'This person draws meaning from spiritual practice, faith, or a sense of transcendence.', '#F5DEB3'),
('Self development and inner growth', 'Freedom and exploration', 'I need space to roam, discover, and not be fixed in one place or role.', 'This person values openness, variety, and the freedom to explore different directions and possibilities.', '#F5DEB3'),
('Self development and inner growth', 'Healing and forgiveness', 'I am working through old wounds and learning to let go of what no longer serves me.', 'This person is engaged in a process of inner healing and moving toward greater peace with their past.', '#F5DEB3'),
('Self development and inner growth', 'Identity and self-knowledge', 'Knowing who I truly am — beneath the roles I play — matters enormously to me.', 'This person is on a journey toward deeper self-understanding and a more integrated sense of self.', '#F5DEB3'),
('Self development and inner growth', 'Inner peace and acceptance', 'I want to find a way to be at ease with myself and with life.', 'This person is oriented toward equanimity and the acceptance of what cannot be changed.', '#F5DEB3'),
('Self development and inner growth', 'Reflection and meaning-making', 'I need time to process my experiences and understand what they mean.', 'This person is introspective by nature and finds meaning through deliberate reflection on their life.', '#F5DEB3'),
('Self development and inner growth', 'Resilience and perseverance', 'I have the capacity to endure difficulty and come through it changed but not broken.', 'This person holds an inner quality of toughness and the ability to recover from adversity.', '#F5DEB3'),
('Self development and inner growth', 'Values and ethics', 'I want to live by a clear set of principles and act in ways I can be proud of.', 'This person is strongly guided by a personal moral framework and holds themselves to high ethical standards.', '#F5DEB3');
