import { useEffect, useState } from "react";

import '../styles/pages/Notifications.scss';

export default function Notifications(props) {

  const [notifs, setNotifs] = useState([]);

  const sendNotification = (content, color, delay) => {
    const newNotifs = [...notifs];
    notifs.push({
      content,
      color,
      delay,
      createDate: new Date(),
      inDelete: false,
    });
  }

  const generateNotifs = () => {
    const notifElements = [];
    for (let notif of notifs) {
      notifElements.push(
        <div className={`notif ${notif.color} ${notif.inDelete ? 'deleting': 'false'}`}>
          <div className="content">
            {notif.content}
          </div>
        </div>
      )
    }
    return notifElements;
  }

  useEffect(() => {
    const notifInterval = setInterval(() => {
      const newNotifs = [];
      for (let notif of notifs) {
        const deleteDate = new Date(notif.createDate);
        deleteDate.setSeconds(notif.createDate.getSeconds() + notif.delay + (notif.inDelete ? 1 : 0));
        if (deleteDate < (new Date()) && !notif.inDelete) {
          const newNotif = {...notif};
          newNotif.inDelete = true;
          newNotifs.push(newNotif);
          continue;
        }
        if (deleteDate > (new Date())) newNotifs.push(notif)
      }
      setNotifs(newNotifs);
    }, 100);

    if (window.mp) {
      window.mp.events.add('browser:notif:send', sendNotification);
      return () => {
        window.mp.events.remove('browser:notif:send', sendNotification);
        clearInterval(notifInterval);
      }
    }
    return () => {
      clearInterval(notifInterval);
    }
  }, [notifs]);

  return (
    <div className="notifsWrapper">
      {generateNotifs()}
    </div>
  );
}