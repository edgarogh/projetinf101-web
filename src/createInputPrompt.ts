export type Transform<T> = ((input: string) => T);

export default function createInputPrompt<T>(
    input: HTMLInputElement,
    button: HTMLButtonElement,
    transform: T extends string ? (Transform<T> | undefined) : Transform<T>,
) {
    input.disabled = true;
    button.disabled = true;

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') button.click();
    });

    return function show(message = '') {
        return new Promise<T>((resolve) => {
            input.placeholder = message;
            input.disabled = false;
            button.disabled = false;

            function onClick() {
                const { value } = input;

                try {
                    const transformed = transform ? transform(value) : value;

                    resolve(transformed as any);

                    input.value = '';
                    input.placeholder = '';
                    input.disabled = true;
                    button.disabled = true;
                    button.removeEventListener('click', onClick);
                } catch (e) {
                    alert(e.message);
                }
            }

            button.addEventListener('click', onClick);
        });
    }
}
