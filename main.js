const colorPicker = document.querySelector('.colorPicker_js')
const blocks = document.querySelectorAll('.block_js')
let colors = document.querySelectorAll('.color_js')


const change = [
    [0, 1.26],
    [0, 1.46],
    [-30, 0.94],
    [0, 0.66],
]

colorChange()

colorPicker.addEventListener('input', function(){
    colorChange()
    // void navigator.clipboard.writeText(colorPicker.value)
})

blocks.forEach(block =>{
    block.addEventListener('click', function (){
        let text = block.children
        colorPicker.value = text[0].textContent
        // void navigator.clipboard.writeText(text[0].textContent)
        colorChange()
    })
})

function colorChange(){
    let i=0
    blocks.forEach(block =>{
        let [red, green, blue] = hexToRgb(colorPicker.value)
        let [hue, saturation, lightness] = rgbToHsl(red, green, blue, change[i][0], change[i][1])
        block.style.backgroundColor = hslToHex(hue, saturation, lightness)
        colors[i].innerHTML = hslToHex(hue, saturation, lightness)
        if (lightness < 0.5){
            colors[i].style.color = "#ffffff"
        } else {
            colors[i].style.color = "#000000"
        }
        i++
    })
}

function hexToRgb(c) {
    let bigint = parseInt(c.split('#')[1], 16)
    let r = (bigint >> 16) & 255
    let g = (bigint >> 8) & 255
    let b = bigint & 255

    return [r, g, b]
}

function rgbToHsl(r, g, b, x, y){
    r/=255
    g/=255
    b/=255
    let max = Math.max(r, g, b)
    let min = Math.min(r, g, b)
    let h, s, l = (max+min)/2

    if (max === min){
        h = s = 0
    } else {
        let d = max - min
        s = d/(1-Math.abs(1-(max+min)))

        switch (max) {
            case r:
                h=(g-b) / d + (g<b ? 6 : 0)
                break
            case g:
                h=(b-r) / d+2
                break
            case b:
                h=(r-g)/d+4
                break
        }
        h/=6
    }

    return [h, (s+x/100) > 1 ? 1 : ((s+x/100) < 0 ? 0 : (s+x/100)), (l*y) > 1 ? 1 : ((l*y) < 0 ? 0 : (l*y))]
}

function hslToHex(h, s, l){
    let r, g, b

    if (s===0){
        r = g = b = l
    } else {
        let q = l < 0.5 ? l*(1+s) : l+s-l*s
        let p = 2 * l - q
        r = hueToRgb(p, q, h+1/3)
        g = hueToRgb(p, q, h)
        b = hueToRgb(p, q, h-1/3)
    }
    r = Math.round(r*255)
    g = Math.round(g*255)
    b = Math.round(b*255)

    return `#${(1<<24 | r<<16 | g<<8 | b).toString(16).slice(1)}`
}

function hueToRgb(p, q, t){
    if (t < 0) t+=1
    if (t > 1) t-=1
    if (t < 1/6) return p+(q-p)*6*t
    if (t < 1/2) return q
    if (t < 2/3) return p+(q-p)*(2/3-t)*6
    return p
}