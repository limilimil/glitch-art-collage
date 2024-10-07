
# Image Collage Name: Deterioration of Family.

## Themes:
Glitch art representing the deterioration of family over time.
With different levels of clarity representing time and memory.


## [View the collage](https://limilimil.github.io/glitch-art-collage/)

Keywords: Family, Decay, Loss, Grief, Isolation, Nostalgia
 
Documentation:
1. Compositing using blendMode(), pixel manipulation and image() function
2. Masking by applying alpha values from one image to another
3. Scaling using the image() function
4. Repetition using loops and pixel manipulation to create glitch effects
5. Convolution using a matrix and pixel array
6. Channel swapping using the pixel array and the replaceChannel function
7. Filters using the filter function, tint() and a gradient using the pixel array
8. Blending using SwapPixels function manipulating the pixel array
  
This example uses a few images:
1. A JPG picture image used as the background
2. A PNG transparent copy of the brickwall background with just the man composed on top of the original image
3. A JPG photo of the sea, firstly used to swap channels and then used again, composed on top with a gradient
4. A JPG photo of a family, not used directly, instead pixels were added to the background image
5. A PNG image of a crack in the wall used for masking. It's background was removed and made transparent.
6. A JPG picture of a hand holding a frame. This was masked by the crack image.


-----------------------------------------
by Liam Cannon, 2024
