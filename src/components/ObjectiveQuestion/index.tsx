import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  Textarea,
  ThemeType,
} from "basicui";
import cloneDeep from "lodash/cloneDeep";
import "./style.css";
import { useEffect, useState } from "react";

interface Props {
  question: { question: string; answer: string; choices: string[] };
  index: number;
  onChange: any;
  onDelete: any;
}

const ObjectiveQuestion = (props: Props) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [state, setState] = useState<{
    question: string;
    answer: string;
    choices: string[];
  }>({
    question: "",
    answer: "",
    choices: [],
  });

  const editQuestion = () => {};

  const deleteQuestion = () => {
    props.onDelete();
  };

  useEffect(() => {
    setState(cloneDeep(props.question));
  }, [props.question]);

  const handleQuestionChange = (event: any) => {
    setState({
      ...state,
      question: event.currentTarget.value || "",
    });
  };

  const handleChoiceTextChange = (event: any, index: number) => {
    const choices = [...state.choices];
    choices[index] = event.currentTarget.value;
    setState({ ...state, choices });
  };

  const handleChoiceChange = (answer: string, index: number) => {
    console.log(answer)
    setState({
      ...state,
      answer,
    });
  };

  const handleSave = () => {
    props.onChange(state);
    setIsEditDialogOpen(false);
  };

  const handleClose = () => {
    setState(cloneDeep(props.question));
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div className="objective-question">
        <div>
          {props.index + 1}. {props.question?.question}
        </div>
        <div className="objective-question__choices">
          {props.question?.choices.map((item) => (
            <Radio
              disabled
              key={item}
              label={item}
              name={item}
              value={item}
              checked={item === props.question.answer}
            />
          ))}
        </div>
        <div className="objective-question__action">
          <Button onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
          <Button onClick={deleteQuestion}>Delete</Button>
        </div>
      </div>
      <Modal isOpen={isEditDialogOpen} onClose={handleClose}>
        <ModalHeader
          heading={`Question ${props.index + 1}`}
          onClose={handleClose}
        />
        <ModalBody>
          <div className="objective-question-edit">
            <Textarea
              name="question"
              value={state?.question}
              rows="10"
              onInput={handleQuestionChange}
            />
            <div className="objective-question__choices">
              {state?.choices.map((item, index: number) => (
                <div
                  className="objective-question__choices__choice"
                  key={index}
                >
                  <Radio
                    checked={item === state.answer}
                    value={item}
                    onChange={() => handleChoiceChange(item, index)}
                  />
                  <Input
                    value={item}
                    name="choice"
                    onInput={(event: any) =>
                      handleChoiceTextChange(event, index)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ObjectiveQuestion;
