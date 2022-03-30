function SvgIconCheckCircle(props) {
  const color = props.color ? props.color : "#3398dc";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width={18}
      height={18}
      {...props}
    >
      <path
        d="M9 0a9 9 0 109 9 9 9 0 00-9-9zM7.7 12.4L4.3 9.2l1.4-1.4 2 1.8 4.6-4.3 1.4 1.4z"
        fill={color}
      />
    </svg>
  );
}

export default SvgIconCheckCircle;
