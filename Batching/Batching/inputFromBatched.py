#python inputFromBatched.py FileTempatNyimpen.data
import datetime
import sys
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def isSameMinute(time1,time2):
    return time1[14:16]==time2[14:16]
def get_batched(cur):
    file_path = sys.argv[1]
    try:
        with open(file_path, 'r') as file:
            lastTime=0
            bobot=0
            idSawah =file.readline().strip()
            total = [0,0,0,0,0,0]
            for line in file:
                data=line[0:].split(';')
                if (lastTime==0) :
                    lastTime = data[6][:16]
                if (isSameMinute(data[6],lastTime)):
                    bobot+=1
                    for i in range(6):
                        total[i]+=float(data[i])
                else:
                    print(bobot)
                    for i in range(6):
                        total[i]=round(total[i]/bobot,2)
                    insert_data_to_remote_postgres(total,cur, lastTime,idSawah)
                    for i in range(6):
                        total[i]=float(data[i])
                    lastTime = data[6]
                    bobot=0
            for i in range(6):
                total[i]=round(total[i]/bobot,2)
            insert_data_to_remote_postgres(total,cur, lastTime,idSawah)
                
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")



def insert_data_to_remote_postgres(data_to_insert, cur,lastTime,idSawah):
    
    insert_query = """
    INSERT INTO DataSensor (idSawah, KelembapanTanah, KelembapanUdara, ph, SuhuUdara, SuhuTanah, cahaya,timestamp) 
    VALUES (%s, %s, %s, %s, %s, %s, %s ,%s);
    """
    
    # Execute the query with the data
    cur.execute(insert_query, (idSawah,*data_to_insert,lastTime))
    
    # Commit the transaction to save changes to the database
    conn.commit()
    
    print(f"Data inserted successfully: {data_to_insert}")



try:
    # Connect to the PostgreSQL server using environment variables
    conn = psycopg2.connect(
        host=os.getenv('PG_HOST'),
        port=os.getenv('PG_PORT'), 
        dbname=os.getenv('PG_DATABASE'),
        user=os.getenv('PG_USER'),
        password=os.getenv('PG_PASSWORD'),
        sslmode="disable"
    )
    # Create a cursor object
    cur = conn.cursor()

    # Example usage:
    get_batched(cur)
except psycopg2.Error as e:
    print(f"Error inserting data: {e}")
finally:
    print(f"ending program\n")





    