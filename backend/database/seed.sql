-- Seed data for development
USE task_tracker;

-- Clear existing data
TRUNCATE TABLE tasks;

-- Insert sample tasks
INSERT INTO tasks (title, description, priority, status, due_date) VALUES
('Complete project proposal', 'Write and submit the Q1 project proposal to stakeholders', 'high', 'in_progress', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Review code changes', 'Review pull requests from the team', 'medium', 'todo', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
('Update documentation', 'Update API documentation with new endpoints', 'low', 'todo', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('Fix bug in login flow', 'Users reporting issues with password reset', 'urgent', 'in_progress', CURDATE()),
('Team meeting preparation', 'Prepare slides for weekly team sync', 'medium', 'done', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
('Database optimization', 'Optimize slow queries in production', 'high', 'todo', DATE_ADD(CURDATE(), INTERVAL 5 DAY));
