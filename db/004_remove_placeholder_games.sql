-- LUXORA db — 004: remove the temporary phase-3 game rows.
-- Only the exact temporary records are selected; real games are untouched.
delete from game
where (name, description) in (values
    ('Luxora Baseplate', 'Build, meet friends, and test classic 2020 physics.'),
    ('Crossroads 2020', 'Classic brick battle on the Luxora grid.'),
    ('Luxora Obby', 'A simple obstacle course for the revival launch.'),
    ('Happy Home', 'Hang out in a familiar classic home.'),
    ('Glass Houses', 'Classic arena combat restored for 2020 RCC.'),
    ('Rocket Arena', 'Launch rockets and survive the arena.'),
    ('Sword Fight Heights', 'Reach the top and master classic sword fighting.'),
    ('Luxora Town', 'A social town running entirely on the Luxora grid.')
);
