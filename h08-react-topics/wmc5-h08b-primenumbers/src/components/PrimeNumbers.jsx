import Form from "react-bootstrap/Form";
import { useReducer } from "react";
import { useMemo } from "react";

function PrimeNumbers() {
    // taken from
    // https://www.w3resource.com/javascript-exercises/javascript-math-exercise-43.php
    const primes = (num) => {
        let arr = Array.from({ length: num - 1 }).map((x, i) => i + 2),
            sqroot = Math.floor(Math.sqrt(num)),
            numsTillSqroot = Array.from({ length: sqroot - 1 }).map(
                (x, i) => i + 2
            );
        numsTillSqroot.forEach(
            (x) => (arr = arr.filter((y) => y % x !== 0 || y === x))
        );
        return arr;
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_MAX_VALUE":
                    return { ...state, maxValue: action.payload };
                case "SET_TEXT_SIZE":
                    return { ...state, textSize: action.payload };
                case "SET_FONT_WEIGHT":
                    return { ...state, fontWeight: action.payload };
                case "SET_TEXT_COLOR":
                    return { ...state, textColor: action.payload };
                default:
                    return state;
            }
        },
        {
            maxValue: 100,
            textSize: "sm",
            fontWeight: "fst-normal",
            textColor: "text-primary",
        }
    );

    let allPrimes = useMemo(() => primes(state.maxValue), [state.maxValue]);

    return (
        <div className="container-fluid bg-light">
            <div className="row">
                <div className="text-center mb-2">
                    <h1>Primzahlen</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8"></div>
                <div>
                    <Form.Group className="mb-3">
                        <Form.Label>Textformatierung</Form.Label>
                        <Form.Select
                            className={`${state.fontWeight} ${state.textColor}`}
                            size={state.textSize}
                            value={state.fontWeight}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_FONT_WEIGHT",
                                    payload: e.target.value,
                                })
                            }
                        >
                            <option value="fw-bold">Fett</option>
                            <option value="fst-normal">Standard</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Größe der Textboxen</Form.Label>
                        <Form.Select
                            className={`${state.fontWeight} ${state.textColor}`}
                            size={state.textSize}
                            value={state.textSize}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_TEXT_SIZE",
                                    payload: e.target.value,
                                })
                            }
                        >
                            <option value="sm">klein</option>
                            <option value="lg">groß</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Farbe der Textboxen</Form.Label>
                        <Form.Select
                            className={`${state.fontWeight} ${state.textColor}`}
                            size={state.textSize}
                            value={state.textColor}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_TEXT_COLOR",
                                    payload: e.target.value,
                                })
                            }
                        >
                            <option value="text-danger">Rot</option>
                            <option value="text-primary">Blau</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Primzahlen bis</Form.Label>
                        <Form.Control
                            className={`${state.fontWeight} ${state.textColor}`}
                            type="number"
                            value={state.maxValue}
                            size={state.textSize}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_MAX_VALUE",
                                    payload: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Anzahl von Primzahlen von 2 bis {10}{" "}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            className={`${state.fontWeight}  ${state.textColor}`}
                            size={state.textSize}
                            disabled={true}
                            value={allPrimes.length}
                        />
                    </Form.Group>
                </div>
            </div>
        </div>
    );
}

export default PrimeNumbers;
