import { describe, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import * as api from "../services/api";
import { QueryClient, QueryClientProvider } from "react-query";

vi.mock("../services/api");

const mockPosts = [
  {
    id: 1,
    title: "Post de Teste",
    images: [
      { src: "https://img1.jpg", alt: "Imagem 1" },
      { src: "https://img2.jpg", alt: "Imagem 2" },
    ],
  },
];

describe("App integration", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();

    (api.default.getPosts as any).mockResolvedValue({
      posts: mockPosts,
      pages: 1,
    });

    (api.default.replaceImage as any).mockResolvedValue({
      success: true,
    });
  });

  const renderApp = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

  it("renderiza título e posts", async () => {
    renderApp();

    expect(screen.getByText("Substituição de Imagens")).toBeInTheDocument();

    const postTitle = await screen.findByText("Post de Teste");
    expect(postTitle).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
  });
});
