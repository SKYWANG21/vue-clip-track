import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { nextTick } from "vue";
import VideoTrack from "@/components/index.vue";
import { useTracksStore } from "@/stores/tracks";

const tracks = [
  {
    id: "track-1",
    type: "subtitle",
    name: "字幕轨道",
    visible: true,
    locked: false,
    order: 0,
    clips: [
      {
        id: "clip-1",
        trackId: "track-1",
        type: "subtitle",
        name: "Clip 1",
        startTime: 0,
        endTime: 5,
        text: "默认字幕内容",
        fontFamily: "Arial",
        fontSize: 14,
        color: "#fff",
      },
    ],
  },
] as any;

async function mountWith(slots?: Record<string, string>) {
  const pinia = createPinia();
  const wrapper = mount(VideoTrack, {
    global: { plugins: [pinia] },
    slots,
  });
  const store = useTracksStore(pinia);
  store.setTracks(JSON.parse(JSON.stringify(tracks)));
  await nextTick();
  await nextTick();
  return wrapper;
}

describe("clip-content 插槽", () => {
  it("不传插槽时渲染默认 Clip 组件", async () => {
    const wrapper = await mountWith();
    expect(wrapper.find(".clip__content").exists()).toBe(true);
    expect(wrapper.find(".subtitle-clip").exists()).toBe(true);
    expect(wrapper.text()).toContain("默认字幕内容");
  });

  it("传入插槽时渲染自定义内容并接收 clip / track 参数", async () => {
    const wrapper = await mountWith({
      "clip-content": `
        <template #default="{ clip, track }">
          <div class="my-clip">{{ track.name }} - {{ clip.name }}</div>
        </template>
      `,
    });
    expect(wrapper.find(".my-clip").exists()).toBe(true);
    expect(wrapper.find(".my-clip").text()).toBe("字幕轨道 - Clip 1");
    expect(wrapper.find(".subtitle-clip").exists()).toBe(false);
  });
});
