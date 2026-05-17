import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './ReminderSettings.css';

const ReminderSettings = ({ onClose }) => {
  const [permission, setPermission] = useState(
    'Notification' in window
      ? Notification.permission
      : 'denied'
  );
  const [reminderTime, setReminderTime] = useState(
    localStorage.getItem('reminderTime') || '20:00'
  );
  const [enabled, setEnabled] = useState(
    localStorage.getItem('reminderEnabled') === 'true'
  );

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Browser does not support notifications');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      toast.success('Notifications enabled!');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('reminderTime', reminderTime);
    localStorage.setItem('reminderEnabled',
      enabled.toString());
    scheduleReminder();
    toast.success('Reminder settings saved!');
    onClose();
  };

  const scheduleReminder = () => {
    if (!enabled || permission !== 'granted') return;

    const [hours, minutes] = reminderTime
      .split(':').map(Number);
    const now = new Date();
    const reminder = new Date();
    reminder.setHours(hours, minutes, 0, 0);

    if (reminder <= now) {
      reminder.setDate(reminder.getDate() + 1);
    }

    const delay = reminder.getTime() - now.getTime();

    setTimeout(() => {
      new Notification('CodeChamp Reminder', {
        body: "Don't break your streak! Time to solve a question.",
        icon: '/favicon.ico'
      });
      scheduleReminder();
    }, delay);
  };

  const testNotification = () => {
    if (permission !== 'granted') {
      toast.error('Please enable notifications first');
      return;
    }
    new Notification('CodeChamp Reminder', {
      body: "Don't break your streak! Time to solve a question.",
      icon: '/favicon.ico'
    });
    toast.success('Test notification sent!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card reminder-card"
        onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-title">
            <Bell size={18} strokeWidth={1.75}
              color="var(--primary)" />
            <h3>Reminder Settings</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {permission !== 'granted' ? (
          <div className="reminder-permission">
            <BellOff size={40} strokeWidth={1.5}
              color="var(--text-muted)" />
            <h4>Enable Notifications</h4>
            <p>
              Allow CodeChamp to send you daily
              reminders to keep your streak alive.
            </p>
            <button
              className="btn-primary"
              onClick={requestPermission}>
              <Bell size={15} strokeWidth={2} />
              Enable Notifications
            </button>
          </div>
        ) : (
          <div className="reminder-settings">
            <div className="reminder-toggle-row">
              <div>
                <p className="reminder-label">
                  Daily Reminder
                </p>
                <p className="reminder-sublabel">
                  Get notified to practice every day
                </p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={e =>
                    setEnabled(e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {enabled && (
              <div className="reminder-time-row">
                <div className="modal-title">
                  <Clock size={16} strokeWidth={1.75}
                    color="var(--text-secondary)" />
                  <span className="reminder-label">
                    Reminder Time
                  </span>
                </div>
                <input
                  type="time"
                  className="time-input"
                  value={reminderTime}
                  onChange={e =>
                    setReminderTime(e.target.value)
                  }
                />
              </div>
            )}

            <div className="reminder-types">
              <h4>You will be reminded about:</h4>
              <div className="reminder-type-item">
                <span className="type-dot streak"></span>
                <span>Daily streak maintenance</span>
              </div>
              <div className="reminder-type-item">
                <span className="type-dot revision"></span>
                <span>Questions marked for revision</span>
              </div>
              <div className="reminder-type-item">
                <span className="type-dot practice"></span>
                <span>Daily practice goal</span>
              </div>
            </div>

            <div className="reminder-footer">
              <button
                className="btn-secondary"
                onClick={testNotification}>
                Test Notification
              </button>
              <button
                className="btn-primary"
                onClick={saveSettings}>
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderSettings;