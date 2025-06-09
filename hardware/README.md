# AgroMesh Hardware Documentation

This directory contains the hardware specifications, wiring diagrams, and setup instructions for the AgroMesh sensor nodes.

## Components

### Required Hardware
- Arduino/Raspberry Pi board
- Grove sensors:
  - Soil moisture sensor
  - Temperature & humidity sensor
  - pH sensor
  - Light sensor
- Solar panel (5V, 1A minimum)
- LiPo battery (3.7V, 2000mAh minimum)
- LoRa module (optional)
- ESP8266/ESP32 (for WiFi connectivity)

### Wiring Diagrams
- `sensor_node_v1.pdf`: Complete wiring diagram for version 1 sensor node
- `power_management.pdf`: Solar charging and power management circuit

## Setup Instructions

1. Assemble the sensor node according to the wiring diagram
2. Upload the firmware from the `firmware/` directory
3. Test each sensor individually
4. Configure the LoRa/WiFi module
5. Deploy in the field with proper weather protection

## Power Management

The sensor node is designed to operate on solar power with battery backup. The power management circuit ensures:
- Efficient solar charging
- Battery protection
- Low power consumption
- Automatic sleep/wake cycles

## Maintenance

- Clean sensors monthly
- Check battery health quarterly
- Update firmware as needed
- Inspect weather protection annually

For detailed specifications and troubleshooting, refer to the individual component documentation. 