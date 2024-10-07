/// ---- IMAGE SOURCES ------------------------

// Anfield 2009-08 by John Dickinson is public domain
// source: https://www.flickr.com/photos/chorley-photos/26787651111/
var brickwall;
//Version of the image with the background removed, only the man remains.
var man;

// Photo of Mother And Child Standing On Seashore by Suzy Hazelwood is licensed under Creative Commons Zero (CC0)
// source: https://www.pexels.com/photo/photo-of-mother-and-child-standing-on-seashore-5337670/
var sea;

// On The Bicycle Path Along The George Washington Parkway Which Is In The Glide Path To National Airport, April 1973 by Dick Swanson is public domain
// source: https://www.flickr.com/photos/usnationalarchives/7461383346/
var family;

// Seattle - 619 Western - crack in wall by Joe Mabel is free to use under GFDL license
// source: https://commons.wikimedia.org/wiki/File:Seattle_-_619_Western_-_crack_in_wall.jpg
// version used was modified with the background removed.
var crack;

// A Person's Hand Touching a Picture Frame by Cottonbro Studio is licensed under Creative Commons Zero (CC0)
// source: https://www.pexels.com/photo/a-person-s-hand-touching-a-picture-frame-8861594/
var frame;

//Combination of crack and frame. See the alphaMask function for more details
var maskedFrame;

//Global variables

//There are always 4 colour channels per pixel (RGBA) so set as a const
const colorChannels = 4;

const sharpMatrix = [
    [ 0, -1, 0 ],          
    [ -1,  5, -1 ],
    [0, -1, 0 ]
];


function preload() {
    brickwall = loadImage("assets/brickwall.jpg");
    man = loadImage("assets/brickwall.png");
    sea = loadImage("assets/sea.jpg");
    family = loadImage("assets/family.jpg");
    frame = loadImage("assets/frame.jpg");
    crack = loadImage("assets/crack.png");
}

function setup() {
    pixelDensity(1);
    
    //Set canvas to size of brickwall image
    createCanvas(brickwall.width/2, brickwall.height/2);
    
    //Resize images to fit canvas or to fit intended artistic usage
    brickwall.resize(brickwall.width/2, brickwall.height/2);
    man.resize(brickwall.width, brickwall.height);
    sea.resize(brickwall.width/2, brickwall.height/1.5);
    family.resize(family.width/2, family.height/2);
    frame.resize(frame.width/4, frame.height/4);
    crack.resize(crack.width/3.4, crack.height/3.4);
    
    //Swaps the brickwall image red channel with the sea image blue channel.
    //a ghosting effect version of sea image is visable
    replaceChannel(brickwall, sea, 0, 2);
    
    //adds a small randomised quantity of pixels from the family image on the canvas
    swapPixels(brickwall, family, 20);
    
    //applies the alpha gradient to the actual sea image 
    brokenAlphaGradient(sea, 50);

    //Sharpens the image of the man only
    man = sharpenImage(man, sharpMatrix, 3);
    //applying ERODE filter after sharpening gives the edges a dark smudge like effect
    man.filter(ERODE);

    
    //Applies alpha values of crack image on the picture frame.
    maskedFrame = alphaMask(frame, crack, 125, 0);
    //blurs resulting image
    maskedFrame.filter(BLUR, 2);

}

function draw() {
    image(brickwall, 0, 0);

    //Sets blendmode for sea image to LIGHTEST so the image appears more faded
    blendMode(LIGHTEST);
    image(sea, 0, 0);

    //Sets blendmode back to BLEND for the other images
    blendMode(BLEND);
    
    image(maskedFrame, 575, 0);
    
    //Subtly darkens image of man
    tint(220);
    image(man, 0, 0);
    
    //Removes tint for other images
    noTint();
}

/**
 * Exchanges a random selection of pixels from one image to another.
 * 
 * @param {p5.Image} srcImg the original image that will have pixels replaced
 * @param {p5.Image} tarImg an image where pixels will be taken pixels for swapping
 * @param {Number} amt percentage of pixels to be taken (1-100)
 */
function swapPixels(srcImg, tarImg, amt) {
    srcImg.loadPixels();
    tarImg.loadPixels();
    //loops through the pixels array of the srcImg
    for(let i = 0; i < srcImg.width; i++)
    {
        for(let j = 0; j < srcImg.height; j++)
        {
            //Pixel index of srcImage
            let srcindex = (i+j*srcImg.width)*colorChannels;
            
            //Scales the tarImg to the srcImg size
            let tarIndexColumn = round(map(i, 0, srcImg.width, 0, tarImg.width));
            let tarIndexRow = round(map(j, 0, srcImg.height, 0, tarImg.height));
            
            //index of tarImg
            let tarIndex = (tarIndexColumn + tarIndexRow * tarImg.width) * colorChannels;
            
            //Selects a random number between 1 to 100
            let num = random(1, 100);
            
            //Condition only applies the tarImg pixels to source if the random num is less than amt
            if(num <= amt)
            {
                srcImg.pixels[srcindex] = tarImg.pixels[tarIndex];
                srcImg.pixels[srcindex+1] = tarImg.pixels[tarIndex+1];
                srcImg.pixels[srcindex+2] = tarImg.pixels[tarIndex+2];
                srcImg.pixels[srcindex+3] = tarImg.pixels[tarIndex+3];
            }
        }
    }
    
    srcImg.updatePixels();
}





/**
 * Sharpens image using the values in the convolution matrix.
 * 
 * @param {p5.Image} img image to sharpen
 * @param {Array} filterMatrix a 2D array used to apply the sharpening filter
 * @param {Number} matrixSize the size of the matrix
 * @returns {p5.Image} A copy of the image with the convolution applied
 */
function sharpenImage(img, filterMatrix, matrixSize) {
    let filteredImage = createImage(img.width,img.height);
    img.loadPixels();
    filteredImage.loadPixels();
    
    for(let x = 0; x < img.width; x++)
    {
        for(let y = 0; y < img.height; y++)
        {
            //calculates the index of a pixel
            let index = (x+y*img.width)*colorChannels;
            
            //carrys out the convolution process of the image using the matrix values
            let convolute = convolution(img, x, y, filterMatrix, matrixSize);
            
            //Condition only applies the convolution on pixels thare are not completely blank
            //This prevents it from being applied to blank backgrounds and transparent pixels.
            if(img.pixels[index] != 0 || img.pixels[index+1] != 0 || img.pixels[index+2] != 0)
            {
                //applies the convolution values to the image
                filteredImage.pixels[index] = red(convolute);
                filteredImage.pixels[index+1] = green(convolute);
                filteredImage.pixels[index+2] = blue(convolute);
                filteredImage.pixels[index+3] = 255;
            }
        }
    }
    
    filteredImage.updatePixels();
    return filteredImage;
}

/**
 * Uses a matrix to carry out the convolution process on colour values of each pixel in an image 
 * 
 * @param {p5.Image} img image to convolute
 * @param {Number} x the x position of the pixel
 * @param {Number} y the y position of the pixel
 * @param {Array} filterMatrix a 2D array for performing convolution
 * @param {Number} matrixSize the size of the matrix
 * 
 * @returns {Image} A copy of the image with the convolution applied
 */
function convolution(img, x, y, matrix, matrixSize) {

    let redSum = 0.0;
    let greenSum = 0.0;
    let blueSum = 0.0;

    let offset = floor(matrixSize / 2);

    for(let row = 0; row < matrixSize; row++)
    {
        for(let column = 0; column < matrixSize; column++)
        {
            //Pixel being tested, constrained within the image bounds. 
            let xPos = constrain(x + row - offset, 0, img.width-1);
            let yPos = constrain(y + column - offset, 0, img.height-1);
            let pixelIndex = (xPos + yPos * img.width) * colorChannels;
            
            //Keeps pixel in bounds
            pixelIndex = constrain(pixelIndex, 0, img.pixels.length-1);
            
            //total RGB values of neighbouring pixels multiplied by matrix
            redSum += img.pixels[pixelIndex] * matrix[row][column];
            greenSum += img.pixels[pixelIndex+1] * matrix[row][column];
            blueSum += img.pixels[pixelIndex+2] * matrix[row][column];
        }
    }
    
    //Values constrained within max colour value of 255
    redSum = constrain(redSum, 0, 255);
    greenSum = constrain(greenSum, 0, 255);
    blueSum = constrain(blueSum, 0, 255);
    
    //Returns as a colour to be applied to image
    return color(redSum, greenSum, blueSum);

}

/**
* Replace one channel of one image with a channel value of another image.
* Can choose which channel to replace and a entirely different channel  to replace it with for unique effects.
* For example: you can replace the red channel with the green channel of another image.
*
* @param {p5.Image} srcImg Image that will have one of it's channels replaced
* @param {p5.Image} channelImage Image that will be the source of new channel values
* @param {Number} channelNum Channel number to replace (from 0-3 for RGBA respectively)
* @param {Number} shiftChannelNum Channel number of the channelImage  (from 0-3 for RGBA respectively)
*/
function replaceChannel(srcImg, channelImage, channelNum, shiftChannelNum) {
    srcImg.loadPixels();
    channelImage.loadPixels();

    for(let row = 0; row < srcImg.height; row++)
    {
        for(let column = 0; column < srcImg.width; column++)
        {
            let index = (column + row * srcImg.width) * colorChannels;
            
            //Maps the channelImage to the size of the source image.
            let channelColumn = round(map(column, 0, srcImg.width, 0, channelImage.width));
            let channelRow = round(map(row, 0, srcImg.height, 0, channelImage.height));
            //Channel index based on mapped values
            let channelIndex = (channelColumn + channelRow * channelImage.width) * colorChannels;

            //Replaces the channel
            srcImg.pixels[index + channelNum] = channelImage.pixels[channelIndex + shiftChannelNum];
        }
    }
    srcImg.updatePixels();
}

/**
*Applies a horizontal gradient of transparency values from left to right.
*However, the gradient is uneven, creating glitchy line effect. This was intentionaly done for artistic reasons
*
*Note: To see a smooth non-glitchy gradient, simply replacing the following line:
*for (let column = round((img.width/divs)*i); column < (img.width/divs)*(i+1); column++)
*with this line:
*for (let column = round((img.width/divs)*i); column < round((img.width/divs)*(i+1)); column++)
*
* @param {p5.Image} img the image that this gradient will be applied to
* @param {Number} divs number of divisions, higher values makes the intensity of changes more subtle
*/
function brokenAlphaGradient(img, divs) {

    //divides maximum alpha by the number of divisions to find the base alpha value
    let baseAlpha = 255 / divs;
    img.loadPixels();
    
    //loops through the pixel array and applies the alpha value based on the current division
    for(let i = 0; i < divs; i++)
    {
        for (let row = 0; row < img.height; row++) 
        {
            //loop condition divides the width by the number of divisions and iterates on the current division.
            //To make the gradient divisions uneven, only the first expresion (setting the column varible) is rounded.
            for (let column = round((img.width/divs)*i); column < (img.width/divs)*(i+1); column++)
            {
                //calculates the index of the pixel to be changed.
                let index = (column + row * img.width) * colorChannels;
                //subtracts the pixel's alpha value by the baseAlpha multiplied by the current division
                img.pixels[index+3]-=  baseAlpha * i;
            }
        }
    }
    img.updatePixels();
}

/**
 * Creates a new image using the source image and the alpha values of the mask image.
 * Similar to the p5 mask() function, except this does not resize either images and
 * you can choose the position of the source image within the mask.
 * 
 *The source image pixels will be applied to non-transparent areas of the mask,
 * based on the source image's offset x and y positions within the mask image (not the canvas).
 * 
 * @param {p5.Image} srcImg source image to Mask
 * @param {p5.Image} maskImg image with alpha values for masking
 * @param {Number} offsetX the x position of the top left corner of the source image within the mask Image
 * @param {Number} offsetY the y position of the top left corner of the source image within the mask Image
 * @returns {p5.Image} New image with the source image applied to the non-transparent areas of the mask image
 */
function alphaMask(srcImg, maskImg, offsetX, offsetY)
{
    srcImg.loadPixels();
    maskImg.loadPixels();
    //Creates a new image with the height and width of maskImg
    let newImg = createImage(maskImg.width, maskImg.height);
    newImg.loadPixels();

    for(let row = 0; row < maskImg.height; row++)
    {
        for(let column = 0; column < maskImg.width; column++)
        {
            //Calculates srcImage pixel index plus the offset position values 
            let srcIndex = ((column+offsetX) + (row+offsetY) * srcImg.width) * colorChannels;
            let maskIndex = (column + row * maskImg.width) * colorChannels;
            
            //checks if the pixel on the mask image is not transparent
            if(maskImg.pixels[maskIndex+3] != 0)
            {
                //applies srcImage pixels to newImg 
                newImg.pixels[maskIndex] = srcImg.pixels[srcIndex];
                newImg.pixels[maskIndex+1] = srcImg.pixels[srcIndex+1];
                newImg.pixels[maskIndex+2] = srcImg.pixels[srcIndex+2];
                newImg.pixels[maskIndex+3] = srcImg.pixels[srcIndex+3];
            }
        }
    }
    newImg.updatePixels();
    return newImg;
}
