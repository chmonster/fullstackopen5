const Blog = ({blog}) => (
  <table>
    <tbody>
      <tr>
        <td><a href={blog.url} title={blog.title} alt={blog.title}>
          {blog.title}
        </a></td> 
        <td style={{textAlign:'right'}}> {blog.author} </td>
      </tr>
    </tbody>
  </table>
)

export default Blog