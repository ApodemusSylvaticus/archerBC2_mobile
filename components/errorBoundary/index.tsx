// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log(error);
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        console.log('error', error);
        console.log('info.componentStack', info.componentStack);

        /*
        logErrorToMyService(error, info.componentStack);
*/
    }

    render() {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state.hasError) {
            // You can render any custom fallback UI
            // eslint-disable-next-line react/destructuring-assignment
            return this.props.fallback;
        }

        // eslint-disable-next-line react/destructuring-assignment
        return this.props.children;
    }
}
