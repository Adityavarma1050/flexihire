-- Seed Data for FlexiHire Database
USE flexihire_db;

-- 1. Insert Initial Categories
INSERT IGNORE INTO categories (id, name, slug, description) VALUES
(1, 'Software Development', 'software-development', 'Web, Mobile, Backend, and Frontend roles'),
(2, 'Design & Creative', 'design-creative', 'UI/UX, Visual Design, Motion, and Branding'),
(3, 'Product Management', 'product-management', 'Product Owners, Technical Program Managers'),
(4, 'Marketing & Sales', 'marketing-sales', 'Growth, SEO, Content, Account Executives'),
(5, 'Customer Support', 'customer-support', 'Technical Support, Customer Success'),
(6, 'Data & Analytics', 'data-analytics', 'Data Engineering, Business Intelligence, Data Science');

-- 2. Insert Test Users (Passwords hashed for 'password123')
INSERT IGNORE INTO users (id, full_name, email, password_hash, role, phone, bio, avatar, status) VALUES
(1, 'John Seeker', 'seeker@flexihire.com', '$2a$10$wT5gP4v7c9.w9gD2bZ.2u.E6Y0aA6mJ2F0K7/w/s2W3456789012', 'job_seeker', '+1 555-0192', 'Full Stack React & Node Developer with 3+ years experience.', NULL, 'active'),
(2, 'Sarah Employer', 'employer@techcorp.com', '$2a$10$wT5gP4v7c9.w9gD2bZ.2u.E6Y0aA6mJ2F0K7/w/s2W3456789012', 'employer', '+1 555-0199', 'Head of Talent Acquisition at TechCorp Systems.', NULL, 'active'),
(3, 'FlexiHire Admin', 'admin@flexihire.com', '$2a$10$wT5gP4v7c9.w9gD2bZ.2u.E6Y0aA6mJ2F0K7/w/s2W3456789012', 'admin', '+1 555-0100', 'Platform Administrator.', NULL, 'active');

-- 3. Insert Test Company
INSERT IGNORE INTO companies (id, user_id, company_name, logo, website, location, description, industry) VALUES
(1, 2, 'TechCorp Systems', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', 'https://techcorp-example.com', 'San Francisco, CA', 'Building next-generation cloud infrastructure and developer tools.', 'Software & Cloud');

-- 4. Insert Test Jobs
INSERT IGNORE INTO jobs (id, employer_id, company_id, category_id, title, description, requirements, job_type, workplace_type, location, salary_min, salary_max, salary_period, experience_level, status) VALUES
(1, 2, 1, 1, 'Senior React / Full Stack Engineer', 'We are seeking an experienced Full Stack Engineer proficient in React, Node.js, and SQL to join our core architecture team.', '5+ years experience with React and Express. Experience with relational databases.', 'Full-Time', 'Remote', 'San Francisco, CA (Remote)', 120000.00, 160000.00, 'yearly', 'Senior', 'open'),
(2, 2, 1, 2, 'UI/UX Product Designer', 'Design intuitive, accessible web application interfaces for our client-facing portal.', '3+ years experience designing web SaaS tools. Figma proficiency.', 'Part-Time', 'Hybrid', 'Austin, TX', 60.00, 85.00, 'hourly', 'Mid', 'open'),
(3, 2, 1, 1, 'Frontend Developer (Internship)', 'Great opportunity for junior developers to gain real-world React experience.', 'Basic understanding of HTML, CSS, JavaScript, and React.', 'Internship', 'Remote', 'Remote', 3000.00, 4500.00, 'monthly', 'Entry', 'open');
