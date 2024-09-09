const components = {
    h1(props) {
      const {node, ...rest} = props
      return <h1 className="text-2xl font-bold leading-none tracking-tight md:text-2xl lg:text-3xl dark:text-white" {...rest} />
    },
    h2(props) {
      const {node, ...rest} = props
      return <h2 className="text-xl font-bold leading-none tracking-tight md:text-xl lg:text-2xl dark:text-white" {...rest} />
    },
    h3(props) {
      const {node, ...rest} = props
      return <h3 className="text-lg font-bold leading-none tracking-tight md:text-lg lg:text-xl dark:text-white" {...rest} />
    },
    h4(props) {
      const {node, ...rest} = props
      return <h4 className="text-base font-bold leading-none tracking-tight md:text-base lg:text-lg dark:text-white" {...rest} />
    },
    h5(props) {
      const {node, ...rest} = props
      return <h5 className="text-sm font-bold leading-none tracking-tight md:text-sm lg:text-base dark:text-white" {...rest} />
    },
    h6(props) {
      const {node, ...rest} = props
      return <h6 className="text-xs font-bold leading-none tracking-tight md:text-xs lg:text-sm dark:text-white" {...rest} />
    },
    // th(props) {
    //   const {node, ...rest} = props
    //   return <th className="text-left text-sm" {...rest}/>
    // },
    // td(props) {
    //   const {node, ...rest} = props
    //   return <td className="text-left text-sm" {...rest}/>
    // },
    // ul(props) {
    //   const {node, ...rest} = props
    //   return <ul className="list-disc flex flex-col gap-1 text-sm" {...rest} />
    // },
    p(props) {
      const {node, ...rest} = props
      return <p style={{marginTop: window.innerWidth > 1000 ? '' : '0.5vh', marginBottom: window.innerWidth > 1000 ? '' : '0.5vh'}} {...rest} />
    },
    ol(props) {
      const {node, ...rest} = props
      return <ol style={{marginTop: window.innerWidth > 1000 ? '' : '0.5vh', marginBottom: window.innerWidth > 1000 ? '' : '0.5vh'}} {...rest} />
    },
  }

export default components;