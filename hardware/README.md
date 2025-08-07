# AgroMesh Hardware Documentation

This directory contains the hardware specifications, wiring diagrams, and setup instructions for the AgroMesh sensor nodes.

## Components

### Required Hardware
- **Arduino Uno WiFi** – for WiFi connectivity
- **NPK 7-in-1 Sensor** – Measures:
  - Soil moisture content  
  - Soil temperature & humidity  
  - Soil pH  
  - Soil conductivity  
  - Soil NPK content (N - Nitrogen, P - Phosphorus, K - Potassium)
- **Solar panel** – 5V, 1A minimum
- **LiPo battery** – 3.7V, 2000mAh minimum
- **Push buttons** – For interaction and control
- **LCD_I2C** – For real-time display

## Wiring Diagrams
- `Soil-Moisture-Sensor-Connections.png` – Complete wiring diagram for version 1  
- `hardware_setup.png` – Complete wiring diagram for version 2  
- `power_management.pdf` – Replaceable and rechargeable battery setup

## Setup Instructions

1. Assemble the sensor node according to the wiring diagram.
2. Upload the firmware from the `firmware/` directory.
3. Test each sensor individually to verify correct operation.
4. Configure the WiFi module for data transmission.
5. Deploy the unit in the field with proper weather protection.

## Power Management

The sensor node is designed to operate on solar power with battery backup. The power management system includes:
- Battery protection circuit
- Low power consumption optimization
- Power button for turning the unit on/off

## Maintenance

- Clean the sensor probes after use to ensure accuracy.
- Check the battery health every 3 months.
- Update the firmware periodically to add features or fix bugs.
- Inspect and replace the weather protection enclosure annually if needed.

---

For detailed specifications and troubleshooting, refer to the individual component datasheets and manuals.
