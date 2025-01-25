function updateTime() {
               const now = new Date();
             
            
               let hours24 = now.getHours();
               let minutes = now.getMinutes();
               let seconds = now.getSeconds();
             
               hours24 = hours24 < 10 ? '0' + hours24 : hours24;
               minutes = minutes < 10 ? '0' + minutes : minutes;
               seconds = seconds < 10 ? '0' + seconds : seconds;
             
             
               let hours12 = hours24 % 12;
               hours12 = hours12 === 0 ? 12 : hours12; 
               const ampm = hours24 >= 12 ? 'PM' : 'AM';
            
               let time12hr = `${hours12}:${minutes}:${seconds} ${ampm}`;
            
               console.log(`24-hour format: ${hours24}:${minutes}:${seconds}`);
               console.log(`12-hour format: ${time12hr}`);
             }
             
             setInterval(updateTime, 1000);
             