fs = 1000; % Hz
duration = 10; % s
dist = 3; % m (between the sound recorders)
sound_speed = 343; % m/s
s1 = zeros(1, duration * fs);
s2 = zeros(1, duration * fs);

peak1 = 1.255; % s
peak2 = 1.25; % s

s1(1, fs * peak1) = 100;
s2(1, fs * peak2) = 100;


[~, peak1out] = max(s1);
[~, peak2out] = max(s2);

peak1out = peak1out / fs; % s
peak2out = peak2out / fs; % s

dt = abs(peak1out - peak2out); % s

% abs(dist /2 - delay * sound_speed) / dist

x1 = (dist + sound_speed * dt) / 2
% x1 / sound_speed = t1
x2 = dist - x1 
figure(1)
plot(xcorr(s1, s2))