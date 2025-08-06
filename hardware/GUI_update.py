from PyQt5.QtCore import *
from PyQt5.QtGui import * 
from PyQt5.QtWidgets import * 
import requests
import sys 
import socket

HOST = "192.168.137.218" 
PORT = 12345            
 
# Create a UDP socket
mySocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
mySocket.settimeout(5.0)  



API_KEY = 'c5dea184858420adca6adbd80355339e'  # Add your API key here 
CITY = 'Gettysburg'


myApp = QApplication([])
window = QMainWindow()
window.setWindowTitle("GUI WORLD")
window.setGeometry(100, 100, 500, 500)
window.setWindowIcon(QIcon("360_F_244719895_WgwXxuFTynvJsP0reqFIzzG1uYv1tgvF.jpg"))


widgetContainer = QWidget()
window.setCentralWidget(widgetContainer)
mainLayout = QVBoxLayout(widgetContainer)


# Top title label with animation
label = QLabel("Welcome to AgroMesh!")
label.setAlignment(Qt.AlignCenter)
label.setFixedHeight(50)
label.setStyleSheet("font-size: 26px; color: blue; padding: 10px;font: Arial;font-weight: bold; font-style: italic;")
mainLayout.addWidget(label)


label.move(300, label.y())
slide_animation = QPropertyAnimation(label, b"pos")
slide_animation.setDuration(1200)
slide_animation.setStartValue(label.pos())
slide_animation.setEndValue(QPoint((window.width() - label.width()) // 7, label.y()))
slide_animation.setEasingCurve(QEasingCurve.OutBounce)
slide_animation.start()


# Second label with fade-in
label2 = QLabel("Explore Our Technologies")
label2.setAlignment(Qt.AlignCenter)
label2.setFixedHeight(50)
label2.setStyleSheet("font-size: 26px; color: blue; padding: 10px;font: Arial;font-weight: bold; font-style: italic;")
mainLayout.addWidget(label2)


opacity_effect = QGraphicsOpacityEffect(label2)
label2.setGraphicsEffect(opacity_effect)
animation = QPropertyAnimation(opacity_effect, b"opacity")
animation.setDuration(1500)
animation.setStartValue(0)
animation.setEndValue(1)
animation.start()


# Layouts for buttons
pushButtonLayout1 = QHBoxLayout()
pushButtonLayout2 = QHBoxLayout()
mainLayout.addLayout(pushButtonLayout1)
mainLayout.addLayout(pushButtonLayout2)


# --- Buttons and Functions ---
def show_message(msg, color="red"):
    output_label.setText(msg)
    output_label.setStyleSheet(f"font-size: 18px; padding: 12px; color: {color};")


# Soil Moisture Button
moistButton = QPushButton("Soil Moisture")
moistButton.setFixedSize(150, 50)
moistButton.setStyleSheet("""
    QPushButton {
        background-color: #e74c3c;
        color: white;
        font-size: 18px;
        font-family: Arial;
        padding: 12px 24px;
        border-radius: 18px;
        border: none;
    }
    QPushButton:hover {
        background-color: #c0392b;
        color: #fffbe6;
    }
    QPushButton:pressed {
        background-color: #a93226;
    }
""")


def moistureLevel():
    show_message("Measuring Soil Moisture...")
    cmd ="moisture\n"
    cmdEncoded=cmd.encode()
    mySocket.sendto(cmdEncoded, (HOST,PORT))
    ##print('Sent '+cmd+' to HOST',HOST,PORT)
    try:
        response, server_address = mySocket.recvfrom(1024)
        print("Server response:", response.decode())
    except socket.timeout:
        print("No response received from server within 5 seconds")
    
moistButton.clicked.connect(moistureLevel)
pushButtonLayout1.addWidget(moistButton)

# Soil Nutrients Button
nutrientButton = QPushButton("Soil Nutrients")
nutrientButton.setFixedSize(152, 50)
nutrientButton.setStyleSheet("""
    QPushButton {
        background-color: #3498db;
        color: white;
        font-size: 18px;
        font-family: Arial;
        padding: 12px 24px;
        border-radius: 18px;
        border: none;
    }
    QPushButton:hover {
        background-color: #2980b9;
        color: #eaf6fb;
    }
    QPushButton:pressed {
        background-color: #2471a3;
    }
""")
def soilNutrientsLevel():
    show_message("Measuring Nutrient Levels...")

nutrientButton.clicked.connect(soilNutrientsLevel)
pushButtonLayout1.addWidget(nutrientButton)

# Soil pH Button
phButton = QPushButton("Soil pH")
phButton.setFixedSize(150, 50)
phButton.setStyleSheet("""
    QPushButton {
        background-color: #27ae60;
        color: white;
        font-size: 18px;
        font-family: Arial;
        padding: 12px 24px;
        border-radius: 18px;
        border: none;
    }
    QPushButton:hover {
        background-color: #229954;
        color: #eaffea;
    }
    QPushButton:pressed {
        background-color: #1e8449;
    }
""")
def soilpHLevel():
    show_message("Measuring Soil pH...")
    
phButton.clicked.connect(soilpHLevel)
pushButtonLayout2.addWidget(phButton)

# Weather Button
weatherButton = QPushButton("Track Weather")
weatherButton.setFixedSize(164, 50)
weatherButton.setStyleSheet("""
    QPushButton {
        background-color: #8e44ad;
        color: white;
        font-size: 18px;
        font-family: Arial;
        padding: 12px 24px;
        border-radius: 18px;
        border: none;
    }
    QPushButton:hover {
        background-color: #6c3483;
        color: #f5eaf7;
    }
    QPushButton:pressed {
        background-color: #5b2c6f;
    }
""")
def track_weather():
    url = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url)
        data = response.json()
        if response.status_code == 200:
            temp = data['main']['temp']
            humidity = data['main']['humidity']
            show_message(f"Temperature in {CITY}: {temp}°C\nHumidity: {humidity}%", color="green")
        else:
            show_message("Error fetching weather data.", color="red")
    except Exception as e:
        show_message(f"An error occurred: {e}", color="red")
weatherButton.clicked.connect(track_weather)
pushButtonLayout2.addWidget(weatherButton)

# Shared Output Label placed *right below the buttons*, with more vertical space for multiline text
output_label = QLabel("Click any button to get output")
output_label.setAlignment(Qt.AlignCenter)
output_label.setStyleSheet("font-size: 18px; padding: 20px; color: green;")
output_label.setWordWrap(True)
output_label.setMinimumHeight(140)  # Increased height for bigger text area

mainLayout.addWidget(output_label)


window.show()
sys.exit(myApp.exec_())
