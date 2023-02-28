<img src="assets/appicon.png" style="width: 1.15em; height: 1.15em; vertical-align: text-bottom;"/> Laser Calibration Tool
=========================================================================================================================

<p align="center">
	<a href="https://github.com/daniel-starke/LaserCalibrationTool/deployments/activity_log?environment=github-pages"><img src="https://img.shields.io/github/deployments/daniel-starke/LaserCalibrationTool/github-pages?label=Deployment"/></a>
	<a href="https://github.com/daniel-starke/LaserCalibrationTool/issues"><img src="https://img.shields.io/github/issues/daniel-starke/LaserCalibrationTool?color=g&label=Issues"/></a>
</p>

The Laser Calibration Tool was written to measure backlash, laser spot size and z-offset
of a laser equipped Snapmaker machine to perform proper calibration on it. But it may work
fine on any other laser cutter as well.

Execution
=========

1. Open the Laser Calibration Tool:  
   https://daniel-starke.github.io/LaserCalibrationTool  
   This is available as progressive web application (PWA).  
2. Choose a preset and/or make individual configurations.
3. Hit `Generate` to create the preview image and Gcode.
4. Hit `Download` to get the Gcode file.
5. Run the downloaded Gcode on your device with a standard 80g/m² paper to cut.

Result Interpretation
=====================

The cut paper can be scanned for proper comparison and measurement.
Put a black paper behind it for proper contrast.
Alternatively, hold the cut paper against the light to find small differences.

Horizontal Backlash Calibration Pattern
---------------------------------------

This pattern tests the backlash in x direction.
It shows 11 columns with multiple horizontal lines of different length.
Choose the rightmost column which all lines vertically aligned.
Multiply the column header with the value at the left top corner.
This is the backlash in x direction of your machine.

**Note:** Make sure backlash compensation is disabled when running this test.

Vertical Backlash Calibration Pattern
-------------------------------------

This pattern tests the backlash in y direction.
It shows 11 columns with multiple vertical lines of different length.
Choose the rightmost column which all lines horizontally aligned.
Multiply the column header with the value at the left top corner.
This is the backlash in y direction of your machine.

**Note:** Make sure backlash compensation is disabled when running this test.

Horizontal Spot Size Calibration Pattern
----------------------------------------

This pattern tests the spot width of the laser.
It shows 11 columns with multiple horizontal lines.
Choose the rightmost one with no gap in-between.
Multiply the column header with the value at the left top corner.
This is the laser spot width of your machine.

**Note:** This test is unaffected by backlash but assumes proper z-axis calibration.

Vertical Spot Size Calibration Pattern
--------------------------------------

This pattern tests the spot height of the laser.
It shows 11 columns with multiple vertical lines.
Choose the rightmost one with no gap in-between.
Multiply the column header with the value at the left top corner.
This is the laser spot height of your machine.

**Note:** This test is unaffected by backlash but assumes proper z-axis calibration.

Spot Focus Length Calibration Pattern
-------------------------------------

This pattern tests the correct z axis setting.
It shows 11 columns with multiple horizontal lines.
The long line in each column is the reference height with `z=0`.
Lines above this are have he laser at a higher position and below this at a lower position.
Choose the column with the thinnest reference line.
Multiply the column header with the value at the leftmost side.
This is the correct offset of your z axis.

**Note:** This pattern requires a machine that can control the z axis.

License
=======

See [LICENSE](LICENSE).  

Contributions
=============

No content contributions are accepted. Please file a bug report or feature request instead.  
This decision was made in consideration of the used license.
