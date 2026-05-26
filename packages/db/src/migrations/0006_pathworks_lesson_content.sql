DO $pathworks_lesson_content$
DECLARE
  seeded_lesson record;
  target_course record;
  inserted_lesson_id uuid;
  target_lesson_id uuid;
  inserted_exercise_id uuid;
  target_exercise_id uuid;
  inserted_section_id uuid;
  target_section_id uuid;
BEGIN
  FOR seeded_lesson IN
    SELECT *
    FROM (
      VALUES
        ('Work Readiness Foundations', 'Professional Communication', 1, 'Module overview: Professional Communication', '<p>In this module, you will practice clear and respectful communication at work. You will learn simple ways to listen, ask questions, and share updates. Communication is a skill you can build one step at a time.</p>
<p>You will practice using a calm tone, checking that you understood, and asking for help when directions are not clear. You can pause at any point and come back later.</p>', NULL, 'Write one communication goal you want to practice at work.'),
        ('Work Readiness Foundations', 'Professional Communication', 2, 'Listening and asking clear questions', '<p>Good listening helps you understand what someone needs. You do not have to remember everything at once. It is okay to ask someone to repeat or write down a step.</p>
<p>A clear question is short and specific. Instead of saying, "I do not get it," try, "Can you show me the first step again?" This helps the other person know how to help.</p>', NULL, 'Think of a task that could be confusing. Write one clear question you could ask.'),
        ('Work Readiness Foundations', 'Professional Communication', 3, 'Giving updates to a supervisor', '<p>Supervisors need simple updates so they know how work is going. A good update says what is done, what is next, and whether you need help.</p>
<p>You can use this pattern: "I finished ____. Next I will ____. I need help with ____." This keeps the message focused and respectful.</p>', NULL, 'Use the update pattern for a task you might do at work.'),
        ('Work Readiness Foundations', 'Professional Communication', 4, 'Respectful tone in hard moments', '<p>Work can feel stressful. A respectful tone does not mean you agree with everything. It means you use words that keep the conversation safe enough to solve the problem.</p>
<p>Try pausing, breathing, and saying what you need in a direct way. For example: "I want to understand. Can we slow down for a minute?"</p>', 'This lesson discusses stressful workplace conversations.', 'Rewrite this sentence in a calmer way: "You never explain things right."'),
        ('Work Readiness Foundations', 'Workplace Norms and Expectations', 1, 'Module overview: Workplace Norms and Expectations', '<p>Every workplace has written and unwritten expectations. These can include dress, phone use, breaks, privacy, and how people ask for help.</p>
<p>This module helps you notice expectations without guessing alone. You will learn how to ask about rules and what to do when expectations are not clear.</p>', NULL, 'Name one workplace expectation you already know.'),
        ('Work Readiness Foundations', 'Workplace Norms and Expectations', 2, 'Written rules and unwritten rules', '<p>Written rules are usually in a handbook, schedule, or sign. Unwritten rules are habits people follow, like where to put personal items or when to lower your voice.</p>
<p>You are allowed to ask about both kinds of rules. Asking early can prevent confusion later.</p>', NULL, 'Write one question you could ask about a workplace rule.'),
        ('Work Readiness Foundations', 'Workplace Norms and Expectations', 3, 'Breaks, phones, and shared spaces', '<p>Breaks help people rest and return ready to work. It is important to know when breaks happen, where to take them, and what phone use is allowed.</p>
<p>Shared spaces also need care. Clean up after yourself, keep paths clear, and ask before using someone else's supplies.</p>', NULL, 'Choose one shared-space habit you can practice this week.'),
        ('Work Readiness Foundations', 'Workplace Norms and Expectations', 4, 'When expectations change', '<p>Sometimes a rule changes or a supervisor gives a new direction. This can be frustrating, especially if you were used to the old way.</p>
<p>You can ask for the new direction in writing or repeat it back to check. A change is easier to follow when you know exactly what is different.</p>', NULL, 'Write a sentence you could use to check a new expectation.'),
        ('Work Readiness Foundations', 'Time Management and Reliability', 1, 'Module overview: Time Management and Reliability', '<p>Reliability means people can count on you to show up, communicate, and do your best. It does not mean you never need support.</p>
<p>This module gives you tools for planning your time, handling delays, and asking for help before a small problem grows.</p>', NULL, 'Write one habit that helps you arrive or log in on time.'),
        ('Work Readiness Foundations', 'Time Management and Reliability', 2, 'Planning the day in small steps', '<p>A long workday can feel easier when you break it into small steps. Start by naming the first task, the next task, and when you will take a break.</p>
<p>Use reminders, checklists, or alarms if they help. Tools are not cheating. They are supports.</p>', NULL, 'Make a three-step plan for the start of a work shift.'),
        ('Work Readiness Foundations', 'Time Management and Reliability', 3, 'Handling lateness or absence', '<p>Sometimes transportation, health, or family needs affect your schedule. If you will be late or absent, tell the right person as soon as you can.</p>
<p>A clear message includes your name, what is happening, and when you expect to arrive or return.</p>', NULL, 'Write a short message you could send if you were running late.'),
        ('Work Readiness Foundations', 'Time Management and Reliability', 4, 'Asking for support before a deadline', '<p>If a deadline feels too close, ask for support early. You can ask which part matters most, whether the task can be split, or if there is a tool that can help.</p>
<p>Early communication shows responsibility. It also gives your supervisor time to help you plan.</p>', NULL, 'Write one sentence asking for help with a deadline.'),
        ('Work Readiness Foundations', 'Conflict Navigation', 1, 'Module overview: Conflict Navigation', '<p>Conflict can happen in any workplace. It may be a misunderstanding, a difference in style, or a problem that needs a supervisor.</p>
<p>This module helps you slow down, name the problem, and choose a next step. You do not have to solve every conflict alone.</p>', 'This module discusses workplace conflict.', 'Write one sign that a conversation may need a pause.'),
        ('Work Readiness Foundations', 'Conflict Navigation', 2, 'Pausing before responding', '<p>When conflict starts, your body may react fast. You might feel hot, tense, shaky, or stuck. A pause gives your brain time to choose safer words.</p>
<p>You can say, "I need a minute," or "Can we come back to this after break?" A pause is a work skill.</p>', 'This lesson discusses stressful workplace conflict.', 'Write a pause sentence you could use at work.'),
        ('Work Readiness Foundations', 'Conflict Navigation', 3, 'Using facts instead of labels', '<p>Labels can make conflict worse. "You are rude" may start an argument. Facts are easier to discuss. "I was interrupted twice during the meeting" is clearer.</p>
<p>Use what you saw, heard, or need. Then ask for the next step.</p>', 'This lesson discusses workplace conflict.', 'Change this label into a fact: "My coworker is impossible."'),
        ('Work Readiness Foundations', 'Conflict Navigation', 4, 'Knowing when to ask a supervisor', '<p>Some conflicts need help. Ask a supervisor if there is bullying, harassment, safety risk, repeated disrespect, or if you tried to solve it and it keeps happening.</p>
<p>Asking for help is not failure. It is part of keeping work safe and respectful.</p>', 'This lesson mentions bullying and harassment at work.', 'Write one situation where it would be right to ask a supervisor for help.'),
        ('Digital Literacy for Work', 'Computer Basics and Internet Safety', 1, 'Module overview: Computer Basics and Internet Safety', '<p>This module covers basic computer actions and simple internet safety habits. You will practice logging in, using a browser, and protecting personal information.</p>
<p>You do not need to be fast. The goal is to become more comfortable and safer online.</p>', NULL, 'Write one computer skill you want to feel more confident doing.'),
        ('Digital Literacy for Work', 'Computer Basics and Internet Safety', 2, 'Logging in and keeping passwords safe', '<p>A password protects your account. Do not share work passwords with coworkers, friends, or people online. If you need help, ask a supervisor or support person without saying the password out loud.</p>
<p>A password manager, written hint, or reset process can help you avoid getting locked out.</p>', NULL, 'Write one safe password habit.'),
        ('Digital Literacy for Work', 'Computer Basics and Internet Safety', 3, 'Using a browser for work tasks', '<p>A browser lets you visit websites. The address bar is where you type a web address. Tabs let you keep more than one page open.</p>
<p>Before typing private information, check that the website address looks right. If something feels wrong, stop and ask.</p>', NULL, 'Name one thing you can check before entering personal information online.'),
        ('Digital Literacy for Work', 'Computer Basics and Internet Safety', 4, 'Spotting unsafe messages', '<p>Some messages try to scare you or rush you. They may say your account will close, you won money, or you must click now.</p>
<p>Pause before clicking links. Check the sender. When in doubt, go to the official website yourself or ask for help.</p>', NULL, 'Write one warning sign of an unsafe message.'),
        ('Digital Literacy for Work', 'Email for Work', 1, 'Module overview: Email for Work', '<p>Email is a common work tool. This module helps you read, write, and organize simple work emails.</p>
<p>You will practice subject lines, clear messages, attachments, and polite follow-up.</p>', NULL, 'Write one reason you might send an email at work.'),
        ('Digital Literacy for Work', 'Email for Work', 2, 'Writing a clear subject line', '<p>A subject line tells the reader what the email is about. Short and clear is best. Examples: "Schedule question" or "Report attached."</p>
<p>A clear subject line helps people answer faster and find the email later.</p>', NULL, 'Write a subject line for an email asking about your schedule.'),
        ('Digital Literacy for Work', 'Email for Work', 3, 'Using a simple email structure', '<p>A useful email has a greeting, one main message, and a clear ask. Keep paragraphs short.</p>
<p>Example: "Hi Jordan, I finished the inventory list. Can you review it before 3 p.m.? Thank you, Maya."</p>', NULL, 'Write a three-sentence email asking for help with a task.'),
        ('Digital Literacy for Work', 'Email for Work', 4, 'Attachments and follow-up', '<p>An attachment is a file you send with an email. Before sending, check that the right file is attached.</p>
<p>If someone does not answer, wait a reasonable time and send a polite follow-up. You can say, "I am checking in on my message from Tuesday."</p>', NULL, 'Write a polite follow-up sentence.'),
        ('Digital Literacy for Work', 'Online Job Applications', 1, 'Module overview: Online Job Applications', '<p>Online applications ask for work history, contact information, and sometimes a resume. This module helps you prepare before you start.</p>
<p>You will learn how to save your work, avoid common mistakes, and ask for help when a form is confusing.</p>', NULL, 'Write one item you should gather before starting an application.'),
        ('Digital Literacy for Work', 'Online Job Applications', 2, 'Preparing information before you apply', '<p>Before opening an application, gather your work dates, school or training history, references, and resume if you have one.</p>
<p>Keep the information in one place. This lowers stress and helps you finish forms more accurately.</p>', NULL, 'List two things you would gather before applying online.'),
        ('Digital Literacy for Work', 'Online Job Applications', 3, 'Reading each question carefully', '<p>Applications can use formal words. Read slowly. Look for required fields, date formats, and upload buttons.</p>
<p>If a question does not apply, use the option provided, such as "N/A," only when the form allows it.</p>', NULL, 'Write one strategy for understanding a confusing application question.'),
        ('Digital Literacy for Work', 'Online Job Applications', 4, 'Saving proof and next steps', '<p>After applying, save a confirmation number, screenshot, or email. Write down the company, job title, and date you applied.</p>
<p>Tracking applications helps you follow up and remember what you sent.</p>', NULL, 'Create a simple tracking line for one job application.'),
        ('Digital Literacy for Work', 'Microsoft Office Basics', 1, 'Module overview: Microsoft Office Basics', '<p>Many jobs use documents, spreadsheets, and slides. This module introduces common tasks in Word, Excel, and PowerPoint.</p>
<p>You do not need to memorize every button. You will practice basic actions you may use at work.</p>', NULL, 'Write one Office tool you have used or want to learn.'),
        ('Digital Literacy for Work', 'Microsoft Office Basics', 2, 'Creating and saving a document', '<p>A document is useful for letters, notes, and reports. Give files clear names, such as "resume-may-2026" or "meeting-notes."</p>
<p>Save your work often. If you use shared computers, ask where files should be stored.</p>', NULL, 'Write a clear file name for a work document.'),
        ('Digital Literacy for Work', 'Microsoft Office Basics', 3, 'Using a simple spreadsheet', '<p>A spreadsheet can track lists, numbers, and schedules. Rows go across. Columns go down. Each box is a cell.</p>
<p>Start with clear headings like Name, Date, Status, or Amount. Good headings make the sheet easier to read.</p>', NULL, 'Create three headings for a simple work tracking spreadsheet.'),
        ('Digital Literacy for Work', 'Microsoft Office Basics', 4, 'Making slides easy to read', '<p>Slides should be simple. Use a large font, short lines, and enough contrast. Do not put every word you will say on the slide.</p>
<p>A good slide supports your message. It does not have to be fancy.</p>', NULL, 'Write one rule for making a slide easier to read.'),
        ('Job Search Skills', 'Knowing Your Strengths', 1, 'Module overview: Knowing Your Strengths', '<p>Your strengths are skills, habits, and experiences that can help you at work. Some strengths come from jobs. Others come from school, family, volunteering, or daily life.</p>
<p>This module helps you name strengths and connect them to job tasks.</p>', NULL, 'Write one strength people have noticed in you.'),
        ('Job Search Skills', 'Knowing Your Strengths', 2, 'Finding skills from daily life', '<p>Skills are not only learned at paid jobs. Planning meals, caring for family, fixing things, organizing rides, or helping a friend can all show work skills.</p>
<p>Look for actions: planning, communicating, solving problems, staying calm, or learning new tools.</p>', NULL, 'Name one daily-life task and the work skill it shows.'),
        ('Job Search Skills', 'Knowing Your Strengths', 3, 'Matching strengths to job tasks', '<p>A strength becomes more useful when you connect it to a job task. If you are patient, that may help with customer service. If you like details, that may help with inventory or data entry.</p>
<p>Use clear examples when talking about strengths.</p>', NULL, 'Match one of your strengths to a job task.'),
        ('Job Search Skills', 'Knowing Your Strengths', 4, 'Talking about strengths with confidence', '<p>Confidence does not mean bragging. It means telling the truth about what you can do and how you are growing.</p>
<p>Try saying, "One strength I bring is ____. An example is ____."</p>', NULL, 'Complete this sentence: One strength I bring is ____.'),
        ('Job Search Skills', 'Resume Basics', 1, 'Module overview: Resume Basics', '<p>A resume is a short document that shows your skills, experience, and contact information. It helps an employer decide whether to interview you.</p>
<p>This module covers simple resume sections and how to describe experience clearly.</p>', NULL, 'Write one section you expect to see on a resume.'),
        ('Job Search Skills', 'Resume Basics', 2, 'Contact information and summary', '<p>Your resume should include your name, phone number, email, and city or region. You do not need to list private details like Social Security number.</p>
<p>A short summary can say the type of work you want and the skills you bring.</p>', NULL, 'Write a one-sentence resume summary for a job you might want.'),
        ('Job Search Skills', 'Resume Basics', 3, 'Writing skill bullets', '<p>A bullet should start with an action word. Examples: helped, organized, cleaned, answered, tracked, prepared, learned.</p>
<p>Keep bullets honest and specific. "Helped customers find items" is clearer than "worked hard."</p>', NULL, 'Write one resume bullet that starts with an action word.'),
        ('Job Search Skills', 'Resume Basics', 4, 'Checking before you send', '<p>Before sending a resume, check spelling, phone number, email, and file name. Ask someone you trust to review it if possible.</p>
<p>A clean resume is easier to read. Simple formatting is okay.</p>', NULL, 'Name two things to check before sending a resume.'),
        ('Job Search Skills', 'Interview Preparation', 1, 'Module overview: Interview Preparation', '<p>An interview is a conversation about a job. The employer wants to know if you can do the work, learn the role, and communicate well.</p>
<p>This module helps you prepare answers, ask questions, and calm nerves.</p>', NULL, 'Write one thing you can do before an interview to prepare.'),
        ('Job Search Skills', 'Interview Preparation', 2, 'Answering common questions', '<p>Many interviews include questions like "Tell me about yourself" or "Why do you want this job?" Prepare short answers before the interview.</p>
<p>Use examples from work, school, volunteering, or daily life.</p>', NULL, 'Write a short answer to: Why do you want this job?'),
        ('Job Search Skills', 'Interview Preparation', 3, 'Using the STAR story', '<p>STAR means Situation, Task, Action, Result. It helps you tell a clear story.</p>
<p>Example: "The stockroom was messy. I needed to organize shelves. I grouped items by type. The team found supplies faster."</p>', NULL, 'Write a short STAR story about solving a problem.'),
        ('Job Search Skills', 'Interview Preparation', 4, 'Questions you can ask the employer', '<p>An interview goes both ways. You can ask about training, schedule, team expectations, or next steps.</p>
<p>Asking questions shows interest and helps you decide if the job fits your needs.</p>', NULL, 'Write one respectful question to ask an employer.'),
        ('Job Search Skills', 'LinkedIn and Online Presence', 1, 'Module overview: LinkedIn and Online Presence', '<p>Your online presence is what people may see about you on the internet. LinkedIn is one place to show work interests and skills.</p>
<p>This module helps you make simple, safe choices online during a job search.</p>', NULL, 'Write one thing an employer might look for online.'),
        ('Job Search Skills', 'LinkedIn and Online Presence', 2, 'Choosing a professional profile', '<p>A professional profile uses a clear name, simple photo if you choose one, and a short description of your work interests.</p>
<p>You do not have to share personal details. Keep the focus on skills, training, and goals.</p>', NULL, 'Write a one-line profile headline for a job area you like.'),
        ('Job Search Skills', 'LinkedIn and Online Presence', 3, 'Posting and privacy choices', '<p>Before posting online, ask: Would I be comfortable if an employer saw this? Privacy settings help, but they are not perfect.</p>
<p>You can keep personal accounts private and use a separate space for work-related information.</p>', NULL, 'Name one privacy choice that can support a job search.'),
        ('Job Search Skills', 'LinkedIn and Online Presence', 4, 'Connecting with people respectfully', '<p>Online networking means connecting with people in a respectful way. Keep messages short and clear.</p>
<p>Example: "Hello, I am learning about office support roles. I would appreciate any advice you are willing to share."</p>', NULL, 'Write a short message asking someone for career advice.'),
        ('Self-Advocacy and Rights', 'Understanding Your Disability Rights (ADA)', 1, 'Module overview: Understanding Your Disability Rights (ADA)', '<p>This module gives a plain-language introduction to disability rights at work. It is not legal advice. It can help you know basic terms and when to ask for support.</p>
<p>You will learn about equal opportunity, reasonable accommodations, and where to find more help.</p>', 'This module discusses disability rights and workplace barriers.', 'Write one question you have about workplace rights.'),
        ('Self-Advocacy and Rights', 'Understanding Your Disability Rights (ADA)', 2, 'What the ADA is for', '<p>The Americans with Disabilities Act, or ADA, is a law that protects many people with disabilities from discrimination. At work, it can support equal access to applying, interviewing, and doing a job.</p>
<p>The ADA does not mean every request is approved. It does mean employers should consider reasonable accommodations when they are needed.</p>', 'This lesson discusses disability discrimination in general terms.', 'Write one way a workplace can be made more accessible.'),
        ('Self-Advocacy and Rights', 'Understanding Your Disability Rights (ADA)', 3, 'Reasonable accommodation basics', '<p>A reasonable accommodation is a change that helps a qualified person with a disability apply for a job or do essential job tasks. Examples may include a schedule change, written instructions, assistive technology, or a quiet workspace.</p>
<p>The best accommodation depends on the person, the job, and the workplace.</p>', NULL, 'Name one accommodation that could help someone do a job task.'),
        ('Self-Advocacy and Rights', 'Understanding Your Disability Rights (ADA)', 4, 'Where to ask for help', '<p>If you are unsure about your rights, you can ask a counselor, job coach, disability organization, or legal aid group. You can also ask Human Resources if you are already employed.</p>
<p>You do not have to figure everything out alone.</p>', NULL, 'Write one person or office you could ask for help with rights questions.'),
        ('Self-Advocacy and Rights', 'How and When to Disclose', 1, 'Module overview: Disclosure Decisions', '<p>Disclosure means sharing disability-related information. You get to think carefully about what to share, when to share it, and who needs to know.</p>
<p>This module helps you make a plan that protects your privacy and supports your work needs.</p>', 'This module discusses disability disclosure and privacy choices.', 'Write one reason a person might choose to disclose or not disclose.'),
        ('Self-Advocacy and Rights', 'How and When to Disclose', 2, 'What disclosure can mean', '<p>Disclosure does not have to mean telling your full medical history. It can be as simple as saying what support you need to do a task.</p>
<p>For example: "Written instructions help me follow multi-step tasks." You can keep the focus on the work need.</p>', 'This lesson discusses disability disclosure.', 'Rewrite this as a work need: "I have a diagnosis and everything is hard."'),
        ('Self-Advocacy and Rights', 'How and When to Disclose', 3, 'Choosing timing and audience', '<p>Some people disclose during hiring. Some wait until after a job offer. Some only share if a need comes up. There is no one right time for everyone.</p>
<p>Think about your goal, the support you need, and who is responsible for handling requests.</p>', 'This lesson discusses privacy and disability disclosure decisions.', 'List two things to consider before choosing when to disclose.'),
        ('Self-Advocacy and Rights', 'How and When to Disclose', 4, 'Keeping notes about requests', '<p>It can help to keep notes about when you asked for support, who you spoke with, and what was decided. Notes can reduce stress and help you remember details.</p>
<p>Keep private information in a safe place. Share only what is needed.</p>', NULL, 'Write a simple note template for tracking an accommodation conversation.'),
        ('Self-Advocacy and Rights', 'Requesting Accommodations', 1, 'Module overview: Requesting Accommodations', '<p>Requesting an accommodation means asking for a change or support that helps you access work. This module helps you prepare a clear request.</p>
<p>You will practice naming the barrier, the support you need, and how it helps with the job.</p>', NULL, 'Write one support that helps you learn or work better.'),
        ('Self-Advocacy and Rights', 'Requesting Accommodations', 2, 'Naming the barrier', '<p>A barrier is something that makes a task harder to access. It might be noise, unclear steps, small print, a rigid schedule, or a tool that does not work for you.</p>
<p>Naming the barrier helps you ask for a useful support.</p>', NULL, 'Name one possible workplace barrier and one support for it.'),
        ('Self-Advocacy and Rights', 'Requesting Accommodations', 3, 'Making a clear request', '<p>A clear request can be short. Try: "Because of my disability, I need ____. This will help me ____."</p>
<p>You can ask in person, by email, or with a form if your workplace uses one.</p>', NULL, 'Use the request pattern to write one accommodation request.'),
        ('Self-Advocacy and Rights', 'Requesting Accommodations', 4, 'Talking through options', '<p>An employer may suggest a different accommodation than the one you requested. You can ask questions and explain what would or would not work.</p>
<p>The goal is to find support that helps you do the job task.</p>', NULL, 'Write one question you could ask if an employer suggests a different support.'),
        ('Self-Advocacy and Rights', 'Navigating Workplace Situations', 1, 'Module overview: Speaking Up at Work', '<p>Speaking up at work can mean asking a question, naming a concern, or requesting support. This module helps you use clear and respectful words.</p>
<p>You will practice deciding when to speak up and how to ask for help safely.</p>', 'This module discusses speaking up about workplace concerns.', 'Write one workplace situation where speaking up could help.'),
        ('Self-Advocacy and Rights', 'Navigating Workplace Situations', 2, 'Small concerns and early questions', '<p>Small concerns are easier to handle early. If directions are unclear, equipment is missing, or a schedule is confusing, ask before the problem grows.</p>
<p>A simple question can prevent mistakes and show that you care about the work.</p>', NULL, 'Write one early question you could ask about a confusing task.'),
        ('Self-Advocacy and Rights', 'Navigating Workplace Situations', 3, 'Safety and respect concerns', '<p>If something feels unsafe or disrespectful, you can ask for help. This may include harassment, threats, unsafe equipment, or repeated bullying.</p>
<p>You deserve a workplace that takes safety and respect seriously.</p>', 'This lesson mentions harassment, threats, unsafe equipment, and bullying.', 'Write one safe next step if you notice a serious workplace concern.'),
        ('Self-Advocacy and Rights', 'Navigating Workplace Situations', 4, 'Choosing the right channel', '<p>Different concerns need different channels. A quick question may go to a team lead. A private concern may go to a supervisor or Human Resources. A rights question may involve a counselor or advocate.</p>
<p>Choosing the right channel helps your concern reach someone who can act.</p>', NULL, 'Match a concern to the person or office you would contact.')
    ) AS lesson_seed(path_title, course_title, lesson_order, lesson_title, lesson_body, content_warning, exercise_prompt)
  LOOP
    FOR target_course IN
      SELECT DISTINCT c.id
      FROM learning_paths lp
      JOIN learning_path_courses lpc ON lpc.path_id = lp.id
      JOIN course c ON c.id = lpc.course_id
      WHERE lp.title = seeded_lesson.path_title
        AND c.title = seeded_lesson.course_title
    LOOP
      inserted_lesson_id := NULL;

      INSERT INTO lesson (course_id, title, note, content_warning, "order", is_unlocked, public, slug)
      SELECT
        target_course.id,
        seeded_lesson.lesson_title,
        '',
        seeded_lesson.content_warning,
        seeded_lesson.lesson_order,
        true,
        false,
        regexp_replace(lower(seeded_lesson.lesson_title), '[^a-z0-9]+', '-', 'g')
      WHERE NOT EXISTS (
        SELECT 1 FROM lesson
        WHERE course_id = target_course.id AND title = seeded_lesson.lesson_title
      )
      RETURNING id INTO inserted_lesson_id;

      IF inserted_lesson_id IS NULL THEN
        SELECT id INTO target_lesson_id
        FROM lesson
        WHERE course_id = target_course.id AND title = seeded_lesson.lesson_title
        LIMIT 1;
      ELSE
        target_lesson_id := inserted_lesson_id;
      END IF;

      INSERT INTO lesson_language (lesson_id, locale, content)
      SELECT target_lesson_id, 'en'::"LOCALE", seeded_lesson.lesson_body
      WHERE NOT EXISTS (
        SELECT 1 FROM lesson_language
        WHERE lesson_id = target_lesson_id AND locale = 'en'::"LOCALE"
      );

      inserted_exercise_id := NULL;

      INSERT INTO exercise (title, description, lesson_id, course_id, "order", is_unlocked, allow_multiple_attempts, section_display_mode, slug)
      SELECT
        'Practice: ' || seeded_lesson.lesson_title,
        seeded_lesson.exercise_prompt,
        target_lesson_id,
        target_course.id,
        seeded_lesson.lesson_order,
        true,
        true,
        'all_questions',
        regexp_replace(lower('practice-' || seeded_lesson.lesson_title), '[^a-z0-9]+', '-', 'g')
      WHERE NOT EXISTS (
        SELECT 1 FROM exercise
        WHERE lesson_id = target_lesson_id AND title = 'Practice: ' || seeded_lesson.lesson_title
      )
      RETURNING id INTO inserted_exercise_id;

      IF inserted_exercise_id IS NULL THEN
        SELECT id INTO target_exercise_id
        FROM exercise
        WHERE lesson_id = target_lesson_id AND title = 'Practice: ' || seeded_lesson.lesson_title
        LIMIT 1;
      ELSE
        target_exercise_id := inserted_exercise_id;
      END IF;

      inserted_section_id := NULL;

      INSERT INTO exercise_section (exercise_id, title, description, "order", color_theme, after_behavior)
      SELECT
        target_exercise_id,
        'Practice reflection',
        'Answer in your own words. There is no timer.',
        1,
        'green',
        '{"action":"continue"}'::jsonb
      WHERE NOT EXISTS (
        SELECT 1 FROM exercise_section
        WHERE exercise_id = target_exercise_id AND title = 'Practice reflection'
      )
      RETURNING id INTO inserted_section_id;

      IF inserted_section_id IS NULL THEN
        SELECT id INTO target_section_id
        FROM exercise_section
        WHERE exercise_id = target_exercise_id AND title = 'Practice reflection'
        LIMIT 1;
      ELSE
        target_section_id := inserted_section_id;
      END IF;

      INSERT INTO question (question_type_id, title, exercise_id, exercise_section_id, points, settings, "order")
      SELECT
        3,
        seeded_lesson.exercise_prompt,
        target_exercise_id,
        target_section_id,
        1,
        '{"minCharacters":20,"maxCharacters":1000,"feedback":"Thanks for thinking this through. Compare your answer with the lesson, then adjust if you want to."}'::jsonb,
        1
      WHERE NOT EXISTS (
        SELECT 1 FROM question
        WHERE exercise_id = target_exercise_id AND title = seeded_lesson.exercise_prompt
      );
    END LOOP;
  END LOOP;
END
$pathworks_lesson_content$;
