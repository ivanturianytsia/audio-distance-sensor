dist = 3; % m (between the sound recorders)
sound_speed = 343; % m/s
start_time1 = 1495895490727;
start_time2 = 1495895490727;
start_delay = (start_time1 - start_time2) / 1000;

[y1, fs1] = audioread(['./recording/' num2str(start_time1) '.wav']);
if start_delay < 0
    offset = abs(start_delay) * fs1;
    y1 = y1(offset:end);
end
figure(1);
plot(y1);

[y2, fs2] = audioread(['./recording/' num2str(start_time2) '.wav']);
if start_delay > 0
    offset = abs(start_delay) * fs2;
    y2 = y2(offset:end);
end
figure(2);
plot(y2);

assert(fs1 == fs2)

fs = fs1;

[~, peak1out] = max(y1);
[~, peak2out] = max(y2);

peak1out = peak1out / fs; % s
peak2out = peak2out / fs; % s

dt = abs(peak1out - peak2out); % s

% abs(dist /2 - delay * sound_speed) / dist

x1 = (dist + sound_speed * dt) / 2
% x1 / sound_speed = t1
x2 = dist - x1 
figure(3)
plot(xcorr(s1, s2))