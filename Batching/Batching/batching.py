#buat runnnya di terminal
#python batching.py FileTempatNyimpen.data idSawah
#ganti arduino_port dengan serial yang dipakai
import datetime
import sys
import serial
import time

arduino_port = 'COM3' 
baud_rate = 9600
# Set timeout to None to wait indefinitely for data, or a small number like 0.1
timeout = None
file_path = sys.argv[1]
idSawah =sys.argv[2]

try:
    # Open the serial port
    ser = serial.Serial(arduino_port, baud_rate, timeout=timeout)
    time.sleep(2) # Give the connection a moment to establish
    with open(file_path, "w") as f:
        f.write(idSawah+'\n')
        print(f"Listening on port {arduino_port}...")

        while True:
            if ser.in_waiting > 0:
                # Read the line from the serial port, decode it, and strip whitespace
                # The data will be bytes, so we must decode it to 'utf-8' string
                arduino_output = ser.readline().decode('utf-8').strip() 
                
                # Print the output, which acts as your Python program's input
                f.write(arduino_output+ ';'+datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")+'\n') 
                print(arduino_output+ ';'+datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")+'\n') 

except serial.SerialException as e:
    print(f"Error opening serial port: {e}")
except KeyboardInterrupt:
    print("Program interrupted by user, closing serial port.")
finally:
    if ser and ser.is_open:
        ser.close()
    
