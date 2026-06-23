import { useToastStore } from '@/lib/toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    useToastStore.setState({
      visible: false,
      message: '',
      type: 'success',
      action: null,
    });
  });

  it('shows a toast with message and type', () => {
    useToastStore.getState().show('Hello', 'info');
    const state = useToastStore.getState();
    expect(state.visible).toBe(true);
    expect(state.message).toBe('Hello');
    expect(state.type).toBe('info');
  });

  it('stores an undo action when provided', () => {
    const onPress = jest.fn();
    useToastStore.getState().show('Deleted', {
      action: { label: 'Undo', onPress },
    });

    const action = useToastStore.getState().action;
    expect(action?.label).toBe('Undo');
    action?.onPress();
    expect(onPress).toHaveBeenCalled();
  });

  it('hides the toast and clears action', () => {
    useToastStore.getState().show('Done');
    useToastStore.getState().hide();
    const state = useToastStore.getState();
    expect(state.visible).toBe(false);
    expect(state.action).toBeNull();
  });
});
