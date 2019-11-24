import createInputPrompt from './createInputPrompt';

class Turtle {
    private context = this.canvas.getContext('2d');

    constructor(private canvas: HTMLCanvasElement) {
        canvas.width = 600;
        canvas.height = 300;
    }

    speed() { }

    up() { }

    begin_fill() { }

    end_fill() { }

    numinput(t) {
        return 3;
        return parseInt(prompt(t));
    }

    native_rect(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string = 'transparent',
        fillColor?: string
    ) {
        this.context.strokeStyle = color;
        this.context.fillStyle = fillColor;

        console.log(arguments);
        if (fillColor) {
            this.context.fillRect(x, 300-y, width, -height);
        } else {
            this.context.strokeRect(x, 300-y, width, -height);
        }
    }

    pencolor() { }
}

const canvas = document.querySelector('canvas');
const turtle = new Turtle(canvas);

const input = createInputPrompt(
    document.querySelector('#input'),
    document.querySelector('#inputOk'),
    (value) => {
        const parsed = parseInt(value);
        if (typeof parsed !== 'number' || isNaN(parsed)) throw new Error('Invalid number');
        return parsed;
    },
);

for (const prop in turtle) {
    const val = turtle[prop];
    (window as any)[prop] = typeof val === 'function' ? val.bind(turtle) : val;
}

(window as any).native_lire_coords = async () => {
    const s = await input('Saisir numéro tour départ : ');
    const e = await input('Saisir numéro tour arrivée : ');

    return [s, e];
}

require('./gen/main.js');
